const express = require("express");
const mongoose = require("mongoose");
const Router = express.Router()

const adminController = require('../controllers/admin.controller')

Router.get('/manageraccount', adminController.getManagerAccount)
Router.post('/manageraccount', adminController.postManagerAccount)
Router.get('/showaccount', adminController.getAccount)

module.exports = Router