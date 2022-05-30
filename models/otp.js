const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const otp = new Schema({
        otp: String,
        user_phoneNumber: String,

    })
    // otp.createIndex({ "otp": 1 }, { expireAfterSeconds: 60 })
module.exports = mongoose.model('otp', otp)