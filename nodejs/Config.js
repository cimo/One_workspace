"use strict";

/* global */

const setting = {
    'debug': false,
    'port': {
        'http': process.env.NODEJS_PORT_HTTP,
        'https': process.env.NODEJS_PORT_HTTPS
    },
    'certificate': {
        'key': `/home/${process.env.WWW_USER_NAME}/root/certificate/${process.env.CERTIFICATE_KEY}`,
        'cert': `/home/${process.env.WWW_USER_NAME}/root/certificate/${process.env.CERTIFICATE_FILE}`
    },
    'digest': {
        'realm': "Auth - Digest",
        'path': `/home/${process.env.WWW_USER_NAME}/root${process.env.WEB_PATH}`,
        'enable': process.env.NODEJS_DIGEST_ENABLE
    }
};

const digestCheck = (digest, callback) => {
    let self = this;

    if (process.env.NODEJS_DIGEST_ENABLE === true) {
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

exports.setting = setting;
exports.digestCheck = digestCheck;