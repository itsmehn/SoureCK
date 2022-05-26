const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    amount : {
        type : Number,
    },
    recepientId: {
        type: String,
        trim : true
    },
    timeStamps : {
        type: String
    },
    status: {
        type: String,
    },
    description: {
        type: String,
        default: 'Chuyen Tien'
    }
})
module.exports = mongoose.model('transaction',transactionSchema)