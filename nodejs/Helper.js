"use strict";

/* global */

const fs = require("fs");

const config = require("./Config");

const writeLog = (message) => {
    if (config.setting.debug === true) {
        fs.appendFile("./debug.log", `${message}\n`, () => {
            console.log(`writeLog => ${message}`);
        });
    }
};

exports.writeLog = writeLog;