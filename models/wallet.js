let mongoose = require('mongoose')


const Schema = mongoose.Schema;

const  walletSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    balance: {
        type: Number,
        default : 10000000
    },
    countWithdraw: {
        type:Number,
        default:2
    }
})

module.exports = mongoose.model('wallet',walletSchema)