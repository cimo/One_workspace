"use strict";

/* global */

const {exec} = require("child_process");

const socketEvent = async(helper, socket, type) => {
    helper.writeLog(`Terminal listen on ${type}`);

    socket.on("t_input", async(data) => {
        if (data.cmd !== undefined) {
            exec(data.cmd, (error, stdout, stderr) => {
                if (error !== null) {
                    socket.emit("t_output", error);

                    helper.writeLog(`Terminal error => ${error}`);
                } else {
                    socket.emit("t_output", {'stdout': stdout, 'stderr': stderr});

                    helper.writeLog(`Terminal output => ${stdout} - ${stderr}`);
                }
            });
        }
        else
            socket.emit("t_output", "cmd is undefined!");
    });
};

exports.socketEvent = socketEvent;