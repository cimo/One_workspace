"use strict";

/* global */

const childProcess = require("child_process");

let cwd = ".";
let cwdPrev = cwd;

const socketEvent = async(helper, socket, type) => {
    helper.writeLog(`Terminal listen on ${type}`);

    socket.on("t_cmd_exec", async(data) => {
        if (data.cmd !== undefined) {
            helper.writeLog(`Terminal t_cmd_exec => ${data.cmd}`);

            let commandSplit = data.cmd.split("&&");

            commandSplit.forEach((value) => {
                let commands = commandLogic(value);

                childProcess.exec(`${commands[0]} ${commands[1].join(" ")}`, {'cwd': cwd, 'shell': true}, (error, stdout, stderr) => {
                    if (error !== null) {
                        socket.emit("t_cmd_exec", {'output': error.code, 'cwd': commands[2]});

                        helper.writeLog(`Terminal t_cmd_exec error => ${error} - ${commands[2]}`);

                        childProcess.exec(`cd ${cwdPrev}`, {'cwd': cwdPrev, 'shell': true}, () => {
                            cwd = cwdPrev;
                        });
                    }
                    else {
                        socket.emit("t_cmd_exec", {'output': stdout, 'error': stderr, 'cwd': commands[2]});

                        helper.writeLog(`Terminal t_cmd_exec stdout => ${stdout} - ${stderr} - ${commands[2]}`);
                    }
                });
            });
        }
        else
            helper.writeLog("Terminal t_cmd_exec => Cmd is not defined!");
    });

    socket.on("t_cmd_spawn", async(data) => {
        if (data.cmd !== undefined) {
            helper.writeLog(`Terminal t_cmd_spawn => ${data.cmd}`);

            let commandSplit = data.cmd.split("&&");

            let spawnCommand = null;

            commandSplit.forEach((value) => {
                let commands = commandLogic(value);

                spawnCommand = childProcess.spawn(commands[0], commands[1], {'cwd': cwd, 'shell': true});

                spawnCommand.stdout.on("data", (data) => {
                    socket.emit("t_cmd_spawn", {'output': data.toString(), 'cwd': commands[2]});

                    helper.writeLog(`Terminal t_cmd_spawn stdout => ${data.toString()} - ${commands[2]}`);
                });

                spawnCommand.stderr.on("data", (data) => {
                    socket.emit("t_cmd_spawn", {'output': data.toString(), 'cwd': commands[2]});

                    helper.writeLog(`Terminal t_cmd_spawn stderr => ${data.toString()} - ${commands[2]}`);

                    childProcess.spawn("cd", [cwdPrev], {'cwd': cwdPrev, 'shell': true});

                    cwd = cwdPrev;
                });
            });

            if (spawnCommand !== null) {
                spawnCommand.on("close", (code) => {
                    socket.emit("t_cmd_spawn", {'output': code, 'cwd': commands[2]});

                    helper.writeLog(`Terminal t_cmd_spawn close => ${code} - ${commands[2]}`);
                });
            }
        }
        else
            helper.writeLog("Terminal t_cmd_spawn => Cmd is not defined!");
    });
};

const commandLogic = (data) => {
    let commandSplit = data.split(" ");
    let command = commandSplit[0];

    commandSplit.shift();

    if (command === "cd") {
        cwdPrev = cwd;

        if (commandSplit[0].charAt(0) === "/")
            cwd = commandSplit[0];
        else
            cwd += `/${commandSplit[0]}`;

        commandSplit[0] = cwd;
    }

    let cwdSplit = cwd.split("/");

    return [command, commandSplit, cwdSplit[cwdSplit.length - 1]];
}

exports.socketEvent = socketEvent;