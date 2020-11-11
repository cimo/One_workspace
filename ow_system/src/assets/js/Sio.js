"use strict";

/* global */

const config = require("@/assets/js/Config.js");

const io = require("socket.io-client");

const socketIo = io(config.setting().websocket.url);

const sendMessage = (socketTag, command, time) => {
    if (time !== undefined && time > 0) {
        let interval = setInterval(() => {
            socketIo.emit(socketTag, command);
        }, time);

        return interval;
    }
    else
        socketIo.emit(socketTag, command);

    return null;
};

const readMessage = (socketTag, callback) => {
    socketIo.on(socketTag, (data) => {
        if (callback !== undefined)
            callback(data);
    });
};

const stopRead = (socketTag) => {
    socketIo.off(socketTag);
}

exports.sendMessage = sendMessage;
exports.readMessage = readMessage;
exports.stopRead = stopRead;