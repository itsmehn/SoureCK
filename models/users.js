const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    phoneNumber: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    fullName: String,
    dateOfbirth: Date,
    address: String,
    imgName: [{
        type: String,
    }, ],
    username: String,
    password: String,
    check: Number,
});

module.exports = mongoose.model("users", UserSchema);