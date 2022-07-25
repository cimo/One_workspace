"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startup = void 0;

var ChildProcess = _interopRequireWildcard(require("child_process"));

var Helper = _interopRequireWildcard(require("./Helper"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Source
const startup = () => {
  if (process.env.NODEJS_SK_PORT_VUE) {
    ChildProcess.exec(`vue ui --headless --host ${process.env.NODEJS_SK_IP} --port ${process.env.NODEJS_SK_PORT_VUE}`, (error, stdout, stderr) => {
      if (error) {
        Helper.writeLog("Vue", `Error => ${error}`);
      } else {
        Helper.writeLog("Vue", `Output => ${stdout} - ${stderr}`);
      }
    });
  }
};

exports.startup = startup;