const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: 'mail.phongdaotao.com', // smtp provider
    port: 25,
    auth: {
        user: 'sinhvien@phongdaotao.com',
        pass: 'svtdtu',
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter