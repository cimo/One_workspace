"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var Fs = _interopRequireWildcard(require("fs"));

var _express = _interopRequireDefault(require("express"));

var Http = _interopRequireWildcard(require("http"));

var Https = _interopRequireWildcard(require("https"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _csurf = _interopRequireDefault(require("csurf"));

var SocketIo = _interopRequireWildcard(require("socket.io"));

var Helper = _interopRequireWildcard(require("./Helper"));

var Sio = _interopRequireWildcard(require("./Sio"));

var Terminal = _interopRequireWildcard(require("./Terminal"));

var Vue = _interopRequireWildcard(require("./Vue"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const originList = [`http://${process.env.NODEJS_SK_DOMAIN}`, `https://${process.env.NODEJS_SK_DOMAIN}`, `http://${process.env.NODEJS_SK_DOMAIN}:${process.env.NODEJS_SK_PORT_HTTP}`, `https://${process.env.NODEJS_SK_DOMAIN}:${process.env.NODEJS_SK_PORT_HTTPS}`];

if (process.env.NODEJS_SK_PORT_RANGE) {
  const portRangeSplit = process.env.NODEJS_SK_PORT_RANGE.split("-");
  const portRangeCount = parseInt(portRangeSplit[1]) - parseInt(portRangeSplit[0]);

  for (let i = 0; i <= portRangeCount; i++) {
    const port = parseInt(portRangeSplit[0]) + i;
    originList.push(`http://${process.env.NODEJS_SK_DOMAIN}:${port}`);
    originList.push(`https://${process.env.NODEJS_SK_DOMAIN}:${port}`);
  }
}

if (process.env.NODEJS_SK_PORT_VUE) {
  originList.push(`http://${process.env.NODEJS_SK_DOMAIN}:${process.env.NODEJS_SK_PORT_VUE}`);
}

const corsOption = {
  originList: originList,
  methodList: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  optionsSuccessStatus: 200
};
const app = (0, _express.default)();
app.use(_express.default.static(process.env.NODEJS_SK_PATH_STATIC));
app.use(_express.default.urlencoded({
  extended: true
}));
app.use(_express.default.json());
app.use((0, _cookieParser.default)());
app.use((0, _cors.default)({
  origin: corsOption.originList,
  methods: corsOption.methodList,
  optionsSuccessStatus: corsOption.optionsSuccessStatus
}));
app.use((0, _csurf.default)({
  cookie: true
}));
app.get("/", Helper.digestCheck((request, result) => {
  result.send("");
}));
const serverHttp = Http.createServer(app);
const serverHttps = Https.createServer({
  key: Fs.readFileSync(process.env.NODEJS_SK_CERTIFICATE_KEY),
  cert: Fs.readFileSync(process.env.NODEJS_SK_CERTIFICATE_FILE)
}, app);
const socketIoServerHttp = new SocketIo.Server(serverHttp, {
  cors: {
    origin: corsOption.originList,
    methods: corsOption.methodList
  },
  transports: ["websocket"],
  pingTimeout: 60000,
  pingInterval: 8000,
  cookie: false
});
const socketIoServerHttps = new SocketIo.Server(serverHttps, {
  cors: {
    origin: corsOption.originList,
    methods: corsOption.methodList
  },
  transports: ["websocket"],
  pingTimeout: 60000,
  pingInterval: 8000,
  cookie: false
});
const portHttp = process.env.NODEJS_SK_PORT_HTTP ? parseInt(process.env.NODEJS_SK_PORT_HTTP) : 0;
const portHttps = process.env.NODEJS_SK_PORT_HTTPS ? parseInt(process.env.NODEJS_SK_PORT_HTTPS) : 0;
serverHttp.listen(portHttp, process.env.NODEJS_SK_IP, 0, () => {
  Helper.writeLog("ServerHttp.listen", `Listen on http://${process.env.NODEJS_SK_IP}:${process.env.NODEJS_SK_PORT_HTTP}`);
  Vue.startup();
});
serverHttps.listen(portHttps, process.env.NODEJS_SK_IP, 0, () => {
  Helper.writeLog("ServerHttps.listen", `Listen on https://${process.env.NODEJS_SK_IP}:${process.env.NODEJS_SK_PORT_HTTPS}`);
});
socketIoServerHttp.on("connection", socket => {
  Terminal.socketEvent(socket, "http").then(() => {});
  Sio.startup(socketIoServerHttp, socket, "http").then(() => {});
});
socketIoServerHttps.on("connection", socket => {
  Terminal.socketEvent(socket, "https").then(() => {});
  Sio.startup(socketIoServerHttps, socket, "https").then(() => {});
});