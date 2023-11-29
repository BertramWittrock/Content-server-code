const crypto = require('crypto');
require('dotenv').config(); // Dette indlæser miljøvariabler fra .env-filen

// Angiv din hemmelige nøgle og algoritme
const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY
//  || 'dinhemmeligenøgleher'; // Anvend miljøvariabel eller fallback

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

module.exports = { encrypt, decrypt };
