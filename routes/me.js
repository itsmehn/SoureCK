const express = require("express");
const { getProfilePage } = require("../controllers/users.controller");
const router = express.Router()

router.get('/', (req, res) => {
    res.render("home-page")
})

module.exports = router