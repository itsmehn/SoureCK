const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const loginFailShecma = new Schema({
    username: {
        type: String,
        unique: true,
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '1m' },
    },
});


module.exports = mongoose.model("loginfail", loginFailShecma);