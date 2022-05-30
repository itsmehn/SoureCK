const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const  walletSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
        unique:true
    },
    balance: {
        type: Number,
        default : 10000000
    },
    countWithdraw: {
        type: Number,
        default:20
    },
    timeWithdraw: {
        type:Date,
        default: Date.now
    }

})
module.exports = mongoose.model('wallet',walletSchema)