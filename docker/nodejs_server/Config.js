"use strict";

/* global */

const digestEnable = false;

exports.settings = {
    'certificates': {
        'key': `${process.env.CERTIFICATE_KEY}`,
        'cert': `${process.env.CERTIFICATE_FILE}`
    },
    'digest': {
        'realm': "Auth - Digest",
        'path': `/home/${process.env.WWW_USER_NAME}/www`,
        'enable': digestEnable
    }
};

exports.digestCheck = (digest, callback) => {
    let self = this;

    if (digestEnable === true) {
        return digest.check((req, res) => {
            callback.apply(self, [req, res]);
        });
    }
    else {
        return (req, res) => {
            callback.apply(self, [req, res]);
        };
    }
};