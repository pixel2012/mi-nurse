let crypto = require('./crypto-js.min');
const secretKey = 'abcdefgabcdefg12';
let mi = {
    version: '0.0.1',
    ip: 'http://api.51mito.com/api/',
    isAuth(){

    },
    ajax: function (param) {
        wx.request({
            url: param.url,
            header: {
                uid: '',
                token: ''
            },
            data: param.data,
            success: function () {
            },
            fail: function () {
            },
            complete: function () {
            }
        });
    },
    store: {
        set: function (key, data) {
            try {
                wx.setStorageSync(key, data);
            } catch (e) {
                console.error(JSON.stringify(e));
            }
        },
        get: function (key) {
            try {
                return wx.getStorageSync(key);
            } catch (e) {
                console.error(JSON.stringify(e));
            }
        },
        remove: function (key) {
            try {
                wx.removeStorageSync(key);
            } catch (e) {
                console.error(JSON.stringify(e));
            }
        },
        clear: function () {
            try {
                wx.clearStorageSync();
            } catch (e) {
                console.error(JSON.stringify(e));
            }
        }
    },
    crypto: {
        encode: function (word) {
            let key = crypto.enc.Utf8.parse(secretKey);
            let result = crypto.enc.Utf8.parse(word);
            let encrypted = crypto.AES.encrypt(result, key, {mode: crypto.mode.ECB, padding: crypto.pad.Pkcs7});
            // var encryptedStr = encrypted.ciphertext.toString();
            return encrypted.toString();
        },
        decode: function (word) {
            let key = crypto.enc.Utf8.parse(secretKey);
            let result = crypto.AES.decrypt(word, key, {mode: crypto.mode.ECB, padding: crypto.pad.Pkcs7});
            return crypto.enc.Utf8.stringify(result).toString();
        }
    },

};
module.exports = mi;

