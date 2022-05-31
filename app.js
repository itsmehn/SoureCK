const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path')
const cookieParser = require("cookie-parser");
const session = require('express-session')
const cookieSession = require('cookie-session')
const MemoryStore = require('session-memory-store')(session)
const cron = require('node-cron');
const mongodb = require('./db')
const app = express();
const users = require('./routes/Users')
const me = require('./routes/me')
const wallet = require('./routes/wallet')
const admin = require('./routes/adminRoute')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static('public'))
app.use(express.static('public'))
app.use(
    cors({
        origin: "*",
    })
);

app.use(cookieParser())
app.use(cookieSession({
    secret: 'secret',
    store: new MemoryStore(60 * 60 * 12),
    cookie: { maxAge: 60 * 60 * 1000 }
}))

app.use('/users', users)
app.use('/', me)
app.use('/wallet', wallet)
app.use('/admin', admin)

const port = process.env.PORT || 3000;
const URI = process.env.MONGODB_URL;
app.listen(port, () => {
    console.log("http://localhost:" + port)
})

mongodb.connect()


// auto update count withdraw
const walletModel = require('./models/wallet')
const job = new cron.schedule('0 0 0 * * *', () => {
    console.log('hello')
    walletModel.updateMany({}, { $set: { countWithdraw: 2 } })
        .catch(e => console.log(e))

}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
})

job.start();