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
//const cors = require("cors");
const socketIo = require("socket.io");

const config = require("./Config");
const helper = require("./Helper");
const sio = require("./Sio");
const terminal = require("./Terminal");
const vue = require("./Vue");

const urlRoot = `${path.dirname(__dirname)}/public`;

const certificate = {
    'key': fs.readFileSync(config.setting.certificate.key),
    'cert': fs.readFileSync(config.setting.certificate.cert)
};

const digest = httpAuth.digest({
    realm: config.setting.digest.realm,
    file: `${config.setting.digest.path}.digest_htpasswd`
});

const app = express();

app.use(express.static(urlRoot));
app.use(bodyParser.urlencoded({'extended': false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrf({'cookie': true}));
//app.use(cors());

const httpServer = http.createServer(app);
const httpsServer = https.createServer(certificate, app);

const socketIoServer = socketIo(httpServer);
const socketIosServer = socketIo(httpsServer);

app.get("/", config.digestCheck(digest, (request, result) => {
    result.send("");
}));

httpServer.listen(config.setting.port.http, () => {
    helper.writeLog(`Listen on ${config.setting.port.http}`);

    vue.startup(helper);
});
httpsServer.listen(config.setting.port.https, () => {
    helper.writeLog(`Listen on ${config.setting.port.https}`);
});

socketIoServer.on("connection", (socket) => {
    sio.startup(helper, socketIoServer, socket, "http");

    terminal.socketEvent(helper, socket, "http");
});
socketIosServer.on("connection", (socket) => {
    sio.startup(helper, socketIosServer, socket, "https");

    terminal.socketEvent(helper, socket, "https");
});