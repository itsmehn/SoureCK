const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path')
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);

const users = require("./routes/Users");
app.get('/', (req, res) => { res.render('login') })
const port = process.env.PORT || 3000;
const URI = process.env.MONGODB_URL;

mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(port, () => console.log(`http://localhost:${port}`));
    })
    .catch((e) => console.log("Unable to connect " + e.message));