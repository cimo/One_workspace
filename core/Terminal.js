"use strict";

/* global process */

const os = require("os");
const fs = require("fs");
const path = require("path");
const pty = require("node-pty");
const childProcess = require("child_process");

const encoding = "utf-8";

const socketEvent = async(helper, socket, type) => {
    helper.writeLog(`Terminal listen on ${type}`);

    _pty(helper, socket);

    _exec(helper, socket);
};

const _pty = (helper, socket) => {
    let ptySpawnList = [];

    socket.on("t_pty_start", (dataStart) => {
        helper.writeLog(`Terminal ${dataStart.tag} start`);

        let shell = os.platform() === "win32" ? "powershell.exe" : "bash";

        ptySpawnList[dataStart.tag] = pty.spawn(shell, [], {
            name: "xterm-color",
            cols: dataStart.size[0],
            rows: dataStart.size[1],
            cwd: process.env.HOME,
            env: process.env
        });

        ptySpawnList[dataStart.tag].on("data", (data) => {
            helper.writeLog(`Terminal t_pty_o_${dataStart.tag} => ${data}`);

            socket.emit(`t_pty_o_${dataStart.tag}`, {'tag': dataStart.tag, 'cmd': data});
        });

        ptySpawnList[dataStart.tag].on("exit", () => {
            if (ptySpawnList[dataStart.tag] !== undefined) {
                helper.writeLog(`Terminal t_pty_o_${dataStart.tag} => xterm_reset`);

                socket.emit(`t_pty_o_${dataStart.tag}`, {'tag': dataStart.tag, 'cmd': "xterm_reset"});

                ptySpawnList[dataStart.tag].destroy();
            }
        });
    });

    socket.on("t_pty_i", (data) => {
        if (ptySpawnList[data.tag] !== undefined && data.tag !== undefined && data.cmd !== undefined) {
            helper.writeLog(`Terminal t_pty_i => ${data.tag} - ${data.cmd}`);

            ptySpawnList[data.tag].write(data.cmd);
        }
    });

    socket.on("t_pty_resize", (data) => {
        if (ptySpawnList[data.tag] !== undefined && data.tag !== undefined && data.size !== undefined) {
            helper.writeLog(`Terminal t_pty_resize => ${data.tag}`);

            ptySpawnList[data.tag].resize(data.size[0], data.size[1]);
        }
    });

    socket.on("t_pty_close", (data) => {
        if (ptySpawnList[data.tag] !== undefined && data.tag !== undefined) {
            helper.writeLog(`Terminal t_pty_close => ${data.tag}`);

            ptySpawnList[data.tag].destroy();

            delete ptySpawnList[data.tag];
        }
    });
};

const _exec = (helper, socket) => {
    socket.on("t_exec_i", (data) => {
        if (data.tag !== undefined && data.cmd !== undefined) {
            helper.writeLog(`Terminal t_exec_i => ${data.tag} - ${data.cmd}`);

            childProcess.exec(data.cmd, (error, stdout, stderr) => {
                if (error !== null) {
                    helper.writeLog(`t_exec_o_${data.tag} => ${error}`);

                    socket.emit(`t_exec_o_${data.tag}`, {'err': error});
                }
                else {
                    helper.writeLog(`t_exec_o_${data.tag} => ${stdout} - ${stderr}`);

                    socket.emit(`t_exec_o_${data.tag}`, {'out': stdout, 'err': stderr});
                }
            });
        }
    });

    socket.on("t_exec_stream_i", (data) => {
        if (data.tag !== undefined && data.cmd !== undefined && data.path !== undefined) {
            helper.writeLog(`Terminal t_exec_stream_i => ${data.tag} - ${data.cmd} - ${data.path} - ${data.content}`);

            let directory = path.dirname(data.path);

            if (fs.existsSync(directory) === true) {
                if (data.cmd === "write" && data.content !== undefined) {
                    let stream = fs.createWriteStream(data.path, {'flags': "w", 'encoding': encoding, 'mode': "0664"});

                    stream.write(data.content);

                    stream.end();

                    stream.on("finish", () => {
                        helper.writeLog(`Write t_exec_stream_o_${data.tag} => end`);

                        socket.emit(`t_exec_stream_o_${data.tag}`, {'chunk': "end"});
                    });
                }
                else if (data.cmd === "read") {
                    if (fs.existsSync(data.path) === true) {
                        let stream = fs.createReadStream(data.path, {'flags': "r", 'encoding': encoding});

                        stream.on("data", (chunkData) => {
                            let chunk = chunkData.toString();

                            helper.writeLog(`Read t_exec_stream_o_${data.tag} => ${chunk}`);

                            socket.emit(`t_exec_stream_o_${data.tag}`, {'chunk': chunk});
                        });

                        stream.on("close", () => {
                            helper.writeLog(`Read t_exec_stream_o_${data.tag} => close`);

                            socket.emit(`t_exec_stream_o_${data.tag}`, {'chunk': "end"});
                        });
                    }
                }
            }
        }
    });
};

exports.socketEvent = socketEvent;
