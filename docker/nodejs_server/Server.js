"use strict";

/* global __dirname */

const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");
const https = require("https");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const httpAuth = require("http-auth");
const socketIo = require("socket.io");

const config = require("./Config");
const helper = require("./Helper");
const sio_Websocket = require("./Sio_Websocket");
const vue = require("./Vue");
const terminal = require("./Terminal");

const portHttp = 1080;
const portHttps = 1443;

const urlRoot = `${path.dirname(__dirname)}/public`;

const certificates = {
    'key': fs.readFileSync(config.settings.certificates.key),
    'cert': fs.readFileSync(config.settings.certificates.cert)
};

const digest = httpAuth.digest({
    realm: "Auth - Digest",
    file: `${config.settings.digest.path}/.digest_htpasswd`
});

const app = express();

const httpServer = http.createServer(app);
const httpsServer = https.createServer(certificates, app);

const socketIoServer = socketIo(httpServer);
const socketIosServer = socketIo(httpsServer);

app.use(express.static(urlRoot));
app.use(bodyParser.urlencoded({'extended': false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrf({'cookie': true}));

app.get("/", config.digestCheck(digest, (request, result) => {
    result.send("");
}));

httpServer.listen(portHttp, () => {
    helper.writeLog(`Listen on ${portHttp}`);
});
httpsServer.listen(portHttps, () => {
    helper.writeLog(`Listen on ${portHttps}`);

    vue.startup();
});

socketIoServer.on("connection", (socket) => {
    //sio_Websocket.startup(socketIoServer, socket);
});
socketIosServer.on("connection", (socket) => {
    sio_Websocket.startup(socketIosServer, socket);

    terminal.socketEvent(socketIosServer, socket);
});