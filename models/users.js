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
    fullName: {
        type: String
    },
    dateOfbirth: Date,
    address: String,
    imageFront: String,
    imageBack: String,
    username: String,
    password: String,
    check: Number,
    //value check: 0- new register; 1- first login and change password; 2- dc kich hoat; 3- vo hieu hoa; 4- vo thoi han
    countLogin: { type: Number, default: 0 },
    checkLoginFail: { type: Number, default: 0 },
    role: {
        type: String,
        default: 'user'
    },
    createAt: { type: Date, default: Date.now() },
    updateAt: Date,
    loginFailAt: Date,
    checkIDCard: { type: Number, default: 0 }
});

module.exports = mongoose.model("users", UserSchema);