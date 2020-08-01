"use strict";

/* global */

// Send to all clients except sender
//socket.broadcast.emit("message");

let connectionCount = 0;

const startup = async(helper, server, socket, type) => {
    let address = JSON.stringify(socket.handshake.address);

    helper.writeLog(`${address} connected on ${type} server.`);

    connectionCount ++;

    server.emit("broadcast", `${connectionCount} clients connected on ${type} server.`);

    let intervalEvent = setInterval(() => {
        serverTime(socket);
    }, 1000);

    socket.emit("message", `Connected to ${type} server.`);

    socket.on("disconnect", () => {
        helper.writeLog(`${address} disconnected from ${type} client.`);

        connectionCount --;

        server.emit("broadcast", `${connectionCount} clients disconnected from ${type} server.`);

        if (connectionCount === 0)
            clearInterval(intervalEvent);

        socket.emit("message", `Disconnected from ${type} server.`);
    });
};

const serverTime = (socket) => {
    let today = new Date();
    
    let fixHours = today.getHours() < 10 ? "0" : "";
    fixHours += today.getHours();
    
    let fixMinuts = today.getMinutes() < 10 ? "0" : "";
    fixMinuts += today.getMinutes();
    
    let fixSeconds = today.getSeconds() < 10 ? "0" : "";
    fixSeconds += today.getSeconds();
    
    let date = `${today.getFullYear()}/${(today.getMonth() + 1)}/${today.getDate()} ${fixHours}:${fixMinuts}:${fixSeconds}`;
    
    socket.emit("serverTime", date);
};

exports.startup = startup;