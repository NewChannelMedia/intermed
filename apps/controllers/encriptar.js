var crypto = require('crypto');

var AESCrypt = {};

AESCrypt.decrypt = function(cryptkey, iv, encryptdata) {
    encryptdata = new Buffer(encryptdata, 'base64').toString('binary');

    var decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv),
        decoded  = decipher.update(encryptdata);

    decoded += decipher.final();
    return decoded;
}

AESCrypt.encrypt = function(cryptkey, iv, cleardata) {
    var encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv),
        encryptdata  = encipher.update(cleardata);

    encryptdata += encipher.final();
    encode_encryptdata = new Buffer(encryptdata, 'binary').toString('base64');
    return encode_encryptdata;
}
