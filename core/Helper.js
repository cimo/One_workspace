"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeLog = exports.serverTime = exports.encrypt = exports.digestCheck = exports.decrypt = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var Fs = _interopRequireWildcard(require("fs"));

var HttpAuth = _interopRequireWildcard(require("http-auth"));

var Crypto = _interopRequireWildcard(require("crypto"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

_dotenv.default.config({
  path: "./env/.env"
});

const httpAuth = HttpAuth.digest({
  realm: process.env.NODEJS_SK_DIGEST_REALM,
  file: `${process.env.NODEJS_SK_DIGEST_PATH}.digest_htpasswd`
});
const cryptAlgorithm = "aes-256-cbc";
const cryptKey = Crypto.createHash("sha256").update(String(process.env.NODEJS_SK_ENCRYPTION_SECRET)).digest("base64").substr(0, 32);

const encryption = () => {
  if (process.env.NODEJS_SK_ENCRYPTION_KEY) {
    if (!Fs.existsSync(process.env.NODEJS_SK_ENCRYPTION_KEY)) {
      const cryptIv = Crypto.randomBytes(16);
      Fs.writeFileSync(process.env.NODEJS_SK_ENCRYPTION_KEY, cryptIv);
    }

    return Fs.readFileSync(process.env.NODEJS_SK_ENCRYPTION_KEY);
  }

  return undefined;
};

const serverTime = () => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const monthOut = month < 10 ? `0${month}` : `${month}`;
  const day = currentDate.getDate();
  const dayOut = day < 10 ? `0${day}` : `${day}`;
  const date = `${currentDate.getFullYear()}/${monthOut}/${dayOut}`;
  const minute = currentDate.getMinutes();
  const minuteOut = minute < 10 ? `0${minute}` : `${minute}`;
  const second = currentDate.getSeconds();
  const secondOut = second < 10 ? `0${second}` : `${second}`;
  const time = `${currentDate.getHours()}:${minuteOut}:${secondOut}`;
  return `${date} ${time}`;
};

exports.serverTime = serverTime;

const writeLog = (tag, value) => {
  if (process.env.NODEJS_SK_DEBUG === "true") {
    Fs.appendFile(`${process.env.NODEJS_SK_PATH_STATIC}debug.log`, `${tag}: ${value}\n`, () => {
      console.log(`WriteLog => ${tag}: `, value);
    });
  }
};

exports.writeLog = writeLog;

const digestCheck = callback => {
  if (process.env.NODEJS_SK_DIGEST === "true") {
    return httpAuth.check((req, res) => {
      callback.apply(void 0, [req, res]);
    });
  } else {
    return (req, res) => {
      callback.apply(void 0, [req, res]);
    };
  }
};

exports.digestCheck = digestCheck;

const encrypt = text => {
  if (text !== "") {
    const cryptIv = encryption();

    if (cryptIv) {
      const cipher = Crypto.createCipheriv(cryptAlgorithm, cryptKey, cryptIv);
      const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
      return encrypted.toString("hex");
    }
  }

  return "";
};

exports.encrypt = encrypt;

const decrypt = hex => {
  if (hex !== "") {
    const cryptIv = encryption();

    if (cryptIv) {
      const decipher = Crypto.createDecipheriv(cryptAlgorithm, cryptKey, Buffer.from(cryptIv));
      const decrypted = Buffer.concat([decipher.update(Buffer.from(hex, "hex")), decipher.final()]);
      return decrypted.toString();
    }
  }

  return "";
};

exports.decrypt = decrypt;