"use strict";

/* global */

const nodeJsPort = window.location.protocol === "http:" ? 1080 : 1443;

const setting = function() {
    return {
        'nodejs': {
            'url': `${window.location.protocol}//localhost:${nodeJsPort}`
        },
        'vuejs': {
            'ui_port': 8000
        }
    };
};

exports.setting = setting;