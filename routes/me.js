const express = require("express");
const { getProfilePage } = require("../controllers/users.controller");
const router = express.Router()

router.get("/", getProfilePage)
module.exports = router