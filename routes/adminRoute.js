const express = require("express");
const mongoose = require("mongoose");
const Router = express.Router()
const checkAdmin = require('../middlewares/checkAdmin')

const adminController = require('../controllers/admin.controller')

Router.get('/manageraccount', checkAdmin, adminController.getManagerAccount)
    // Router.post('/manageraccount', adminController.postManagerAccount)
Router.get('/showaccount', adminController.getAccount)

module.exports = Router