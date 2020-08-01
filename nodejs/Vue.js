"use strict";

/* global */

const {exec} = require("child_process");

const startup = async(helper) => {
    exec(`vue ui --headless --host 0.0.0.0 --port ${process.env.NODEJS_PORT_VUE}`, (error, stdout, stderr) => {
        if (error !== null)
            helper.writeLog(`Vue error => ${error}`);
        else
            helper.writeLog(`Vue output => ${stdout} - ${stderr}`);
    });
};

exports.startup = startup;