const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path')
const cookieParser = require("cookie-parser");
const expressSession = require('express-session')
const cookieSession = require('cookie-session')
const MemoryStore = require('session-memory-store')(expressSession)


const app = express();
const users = require('./routes/Users')
const me = require('./routes/me')
const wallet = require('./routes/wallet')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static('public'))
app.use(
    cors({
        origin: "*",
    })
);
app.use(cookieParser())
app.use(cookieSession({
    secret: 'secret',
    store: new MemoryStore(60 * 60 * 12),
    cookie: { maxAge: 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: true
}))


app.use('/users', users)
app.use('/', me)
app.use('/wallet', wallet)
app.use((req, res) => {
    if (!req.session.account) {
        res.redirect('/users/login')
    }


})

const port = process.env.PORT || 3000;
const URI = process.env.MONGODB_URL;

mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(port, () => console.log(`http://localhost:${port}`));
    })
    .catch((e) => console.log("Unable to connect " + e.message));