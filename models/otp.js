const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otpShecma = new Schema({
    phoneNumber: {
        type: String,
    },
    otp: Number,
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '1m' },
    },
});


module.exports = mongoose.model("otp", otpShecma);