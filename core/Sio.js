"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startup = void 0;

var Helper = _interopRequireWildcard(require("./Helper"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Source
const startup = async (server, socket, type) => {
  const address = JSON.stringify(socket.handshake.address);
  const intervalEvent = setInterval(() => {
    const serverTime = Helper.serverTime();
    socket.emit("server_time", serverTime);
  }, 1000);
  Helper.writeLog("Sio connected", `${address} connected to ${type} server.`);
  socket.broadcast.emit("broadcast", `Clients connected to ${type} server.`);
  socket.emit("message", `Connected to ${type} server.`);
  socket.on("disconnect", () => {
    Helper.writeLog("Sio disconnect", `${address} disconnected from ${type} server.`);
    socket.broadcast.emit("broadcast", `Clients disconnected from ${type} server.`);
    socket.emit("message", `Disconnected from ${type} server.`);
    clearInterval(intervalEvent);
  });
};

exports.startup = startup;