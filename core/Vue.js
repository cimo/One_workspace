"use strict";

const childProcess = require("child_process");

const config = require("./Config");

const startup = async(helper) => {
    childProcess.exec(`vue ui --headless --host ${config.setting.ip} --port ${config.setting.port.vue}`, (error, stdout, stderr) => {
        if (error !== null)
            helper.writeLog(`Vue error => ${error}`);
        else
            helper.writeLog(`Vue output => ${stdout} - ${stderr}`);
    });
};

exports.startup = startup;