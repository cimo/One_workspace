"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.data = void 0;
// Source
var data = {
  debug: process.env.NODEJS_DEBUG,
  ip: process.env.NODEJS_IP,
  pathStatic: process.env.NODEJS_PATH_STATIC,
  cwd: process.env.HOME,
  env: process.env,
  socketIo: {
    domain: process.env.NODEJS_DOMAIN
  },
  port: {
    http: process.env.NODEJS_PORT_HTTP,
    https: process.env.NODEJS_PORT_HTTPS,
    vue: process.env.NODEJS_PORT_VUE,
    range: process.env.NODEJS_PORT_RANGE
  },
  certificate: {
    key: "/home/".concat(process.env.WWW_USER_NAME, "/root/certificate/").concat(process.env.CERTIFICATE_KEY),
    cert: "/home/".concat(process.env.WWW_USER_NAME, "/root/certificate/").concat(process.env.CERTIFICATE_FILE)
  },
  digest: {
    realm: "Auth - Digest",
    path: "/home/".concat(process.env.WWW_USER_NAME, "/root").concat(process.env.WEB_PATH),
    active: process.env.NODEJS_DIGEST
  },
  encryption: {
    secret: process.env.NODEJS_ENCRYPTION_SECRET,
    key: process.env.NODEJS_ENCRYPTION_KEY
  }
};
exports.data = data;