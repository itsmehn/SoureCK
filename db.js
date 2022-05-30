const mongoose = require('mongoose')
const MONGODB_URL = process.env.MONGODB_URL
const mongodb = {
    connect: () => {
        mongoose.connect(
            MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        ).then(() => {
            console.log("Database connected")
        }).catch((err) => {
            console.log(err)
        })
    },
    disconnect: async() => {
        Object.keys(mongoose.connection.models).forEach(key => {
            delete mongoose.connection.models[key]
        })
        await mongoose.disconnect()

    }
}
module.exports = mongodb