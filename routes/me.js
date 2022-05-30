const express = require("express");
const userCt = require('../controllers/users.controller')
const router = express.Router()


router.get('/', userCt.getHomePage)
router.get('/logout', userCt.getLogout)

module.exports = router