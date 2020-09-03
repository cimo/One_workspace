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
    let tag = "";
    let ptySpawnList = [];

    socket.on("t_pty_start", (data) => {
        helper.writeLog("Terminal start");

        tag = data.tag;

        let shell = os.platform() === "win32" ? "powershell.exe" : "bash";

        ptySpawnList[tag] = pty.spawn(shell, [], {
            name: "xterm-color",
            cols: 80,
            rows: 24,
            cwd: process.env.HOME,
            env: process.env
        });

        ptySpawnList[tag].on("data", (data) => {
            helper.writeLog(`Terminal t_pty_o_${tag} => ${data}`);

            socket.emit(`t_pty_o_${tag}`, data);
        });

        ptySpawnList[tag].on("exit", () => {
            if (ptySpawnList[tag] !== undefined) {
                helper.writeLog(`Terminal t_pty_o_${tag} => xterm_reset`);

                socket.emit(`t_pty_o_${tag}`, "xterm_reset");

                ptySpawnList[tag].destroy();
            }
        });
    });

    socket.on("t_pty_i", (data) => {
        if (data.tag !== undefined && data.cmd !== undefined && ptySpawnList[data.tag] !== undefined) {
            helper.writeLog(`Terminal t_pty_i => ${data.tag} - ${data.cmd}`);

            tag = data.tag;

            ptySpawnList[tag].write(data.cmd);
        }
    });

    socket.on("t_pty_close", (data) => {
        if (data.tag !== undefined && ptySpawnList[data.tag] !== undefined) {
            helper.writeLog(`Terminal t_pty_close => ${data.tag}`);

            tag = "";

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
                    let stream;
                    stream = fs.createWriteStream(data.path, {'flags': "w", 'encoding': encoding, 'mode': "0664"});

                    stream.write(data.content);

                    stream.end();

                    stream.on("finish", () => {
                        helper.writeLog(`Write t_exec_stream_o_${data.tag} => end`);

                        socket.emit(`t_exec_stream_o_${data.tag}`, {'chunk': "end"});
                    });
                }
                else if (data.cmd === "read") {
                    let stream;
                    stream = fs.createReadStream(data.path, {'flags': "r", 'encoding': encoding});

                    stream.on("data", function (chunkData) {
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
    });
};

exports.socketEvent = socketEvent;