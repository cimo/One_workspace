"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.socketEvent = void 0;

var Os = _interopRequireWildcard(require("os"));

var Fs = _interopRequireWildcard(require("fs"));

var Path = _interopRequireWildcard(require("path"));

var Pty = _interopRequireWildcard(require("node-pty"));

var ChildProcess = _interopRequireWildcard(require("child_process"));

var Helper = _interopRequireWildcard(require("./Helper"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const ptySpawnList = [];
const writeStreamEncoding = "utf-8";

const eventPty = socket => {
  socket.on("t_pty_start", dataStart => {
    if (dataStart.tag) {
      Helper.writeLog("T_pty_start", `Terminal ${dataStart.tag} start`);
      const shell = Os.platform() === "win32" ? "powershell.exe" : "bash";

      if (dataStart.sizeList) {
        ptySpawnList[dataStart.tag] = Pty.spawn(shell, [], {
          name: "xterm-color",
          cols: dataStart.sizeList[0],
          rows: dataStart.sizeList[1],
          cwd: process.env.HOME,
          env: process.env
        });
        ptySpawnList[dataStart.tag].on("data", data => {
          Helper.writeLog("T_pty_start - data", `Terminal t_pty_o_${dataStart.tag} => ${data}`);
          socket.emit(`t_pty_o_${dataStart.tag}`, {
            tag: dataStart.tag,
            cmd: data
          });
        });
        ptySpawnList[dataStart.tag].on("exit", () => {
          if (dataStart.tag && ptySpawnList[dataStart.tag]) {
            Helper.writeLog("T_pty_start - exit", `Terminal t_pty_o_${dataStart.tag} => xterm_reset`);
            socket.emit(`t_pty_o_${dataStart.tag}`, {
              tag: dataStart.tag,
              cmd: "xterm_reset"
            });
            ptySpawnList[dataStart.tag].destroy();
            delete ptySpawnList[dataStart.tag];
          }
        });
      }
    }
  });
  socket.on("t_pty_i", data => {
    if (data.tag && data.cmd && ptySpawnList[data.tag]) {
      Helper.writeLog("T_pty_i", `Terminal t_pty_i => ${data.tag} - ${data.cmd}`);
      ptySpawnList[data.tag].write(data.cmd);
    }
  });
  socket.on("t_pty_resize", data => {
    if (data.tag && data.sizeList && ptySpawnList[data.tag]) {
      Helper.writeLog("T_pty_resize", `Terminal t_pty_resize => ${data.tag}`);
      ptySpawnList[data.tag].resize(data.sizeList[0], data.sizeList[1]);
    }
  });
  socket.on("t_pty_close", data => {
    if (data.tag && ptySpawnList[data.tag]) {
      Helper.writeLog("T_pty_close", `Terminal t_pty_close => ${data.tag}`);
      ptySpawnList[data.tag].destroy();
      delete ptySpawnList[data.tag];
    }
  });
};

const eventExec = socket => {
  socket.on("t_exec_i", dataStart => {
    if (dataStart.tag && dataStart.cmd) {
      Helper.writeLog("T_exec_i", `Terminal t_exec_i => ${dataStart.tag} - ${dataStart.cmd}`);
      const execResult = ChildProcess.exec(dataStart.cmd);

      if (execResult && execResult.stdout && execResult.stderr) {
        execResult.stdout.on("data", data => {
          Helper.writeLog("T_exec_i - stdout data", `t_exec_o_${dataStart.tag} => stdout: ${data}`);
          socket.emit(`T_exec_o_${dataStart.tag}`, {
            out: data
          });
        });
        execResult.stderr.on("data", data => {
          Helper.writeLog("T_exec_i - stderr data", `t_exec_o_${dataStart.tag} => stderr: ${data}`);
          socket.emit(`t_exec_o_${dataStart.tag}`, {
            err: data
          });
        });

        if (dataStart.closeActive) {
          execResult.on("close", data => {
            Helper.writeLog("T_exec_i - close", `t_exec_o_${dataStart.tag} => close: ${data}`);
            socket.emit(`t_exec_o_${dataStart.tag}`, {
              close: data
            });
          });
        }
      }
    }
  });
  socket.on("t_exec_stream_i", dataStart => {
    if (dataStart.tag && dataStart.cmd && dataStart.path) {
      Helper.writeLog("T_exec_stream_i", `Terminal t_exec_stream_i => ${dataStart.tag} - ${dataStart.cmd} - ${dataStart.path} - ${dataStart.content}`);
      const directory = Path.dirname(dataStart.path);

      if (Fs.existsSync(directory)) {
        if (dataStart.cmd === "write" && dataStart.content) {
          const stream = Fs.createWriteStream(dataStart.path, {
            flags: "w",
            encoding: writeStreamEncoding,
            mode: 0o0664
          });
          stream.write(dataStart.content);
          stream.end();
          stream.on("finish", () => {
            Helper.writeLog("T_exec_stream_i - finish", `Write t_exec_stream_o_${dataStart.tag} => finish`);
            socket.emit(`t_exec_stream_o_${dataStart.tag}`, {
              chunk: "end"
            });
          });
        } else if (dataStart.cmd === "read") {
          if (Fs.existsSync(dataStart.path)) {
            const stream = Fs.createReadStream(dataStart.path, {
              flags: "r",
              encoding: writeStreamEncoding
            });
            stream.on("data", data => {
              const chunk = data.toString();
              Helper.writeLog("T_exec_stream_i - data", `Read t_exec_stream_o_${dataStart.tag} => ${chunk}`);
              socket.emit(`t_exec_stream_o_${dataStart.tag}`, {
                chunk: chunk
              });
            });
            stream.on("close", () => {
              Helper.writeLog("T_exec_stream_i - close", `Read t_exec_stream_o_${dataStart.tag} => close`);
              socket.emit(`t_exec_stream_o_${dataStart.tag}`, {
                chunk: "end"
              });
            });
          }
        }
      }
    }
  });
};

const eventCrypt = socket => {
  socket.on("t_crypt_encrypt_i", dataStart => {
    if (dataStart.tag && (dataStart.text === "" || dataStart.text)) {
      Helper.writeLog("T_crypt_encrypt_i", `Execute t_crypt_encrypt_i => ${dataStart.tag} - ${dataStart.text}`);
      socket.emit(`t_crypt_encrypt_o_${dataStart.tag}`, {
        out: Helper.encrypt(dataStart.text)
      });
    }
  });
  socket.on("t_crypt_decrypt_i", dataStart => {
    if (dataStart.tag && (dataStart.hex === "" || dataStart.hex)) {
      Helper.writeLog("T_crypt_decrypt_i", `Execute t_crypt_decrypt_i => ${dataStart.tag} - ${dataStart.hex}`);
      socket.emit(`t_crypt_decrypt_o_${dataStart.tag}`, {
        out: Helper.decrypt(dataStart.hex)
      });
    }
  });
};

const socketEvent = async (socket, type) => {
  Helper.writeLog("SocketEvent", `Terminal listen on ${type}`);
  eventPty(socket);
  eventExec(socket);
  eventCrypt(socket);
};

exports.socketEvent = socketEvent;