"use strict";

/* global */

const {exec} = require("child_process");

exports.startup = async() => {
    exec(`vue ui --headless --host 0.0.0.0 --port ${process.env.NODEJS_PORT_VUE}`, (error, stdout, stderr) => {
        if (error)
            console.log(error);
        else
            console.log(stdout, stderr);
    });
};