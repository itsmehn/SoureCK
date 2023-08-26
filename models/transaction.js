const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var randomstring = require("randomstring");
const { v1: uuidv1 } = require('uuid');

const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    amount : {
        type : Number,
    },
    fee: {
        type: Number,
        default : 0
    },
    userFee: {
        type: Number
    },
    recepientId: {
        type: String,
        trim : true
    },
    timeStamps : {
        type: Date,
        default:Date.now
    },
    status: {
        type: String,
    },
    description: {
        type: String,
        default: 'Chuyen Tien'
    },
    codeCard: [{
        type : String
    }],
    action: {
        type: String,
        default: "CT"
    },
    codeTrans: {
        type:String,
        default: uuidv1(),
        unique:true
    }
})
module.exports = mongoose.model('transaction',transactionSchema)