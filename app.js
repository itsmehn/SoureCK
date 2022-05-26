const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path')
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken')

const app = express();
const users = require('./routes/Users')
const me = require('./routes/me')

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



app.use('/users', users)
app.use('/', me)

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