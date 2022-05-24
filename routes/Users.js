const express = require("express");
const mongoose = require("mongoose");
const Router = express.Router()
const DataUser = require('../models/users')
const registerValidator = require('../middlewares/registerValidator')
const userController = require('../controllers/users.controller');
const upload = require("../middlewares/uploads")

Router.get('/register', userController.getRegister)
Router.post('/register',
    upload.fields([{ name: 'imageFront', maxCount: 1 }, { name: 'imageBack', maxCount: 1 }]),
    registerValidator, userController.postRegister)

module.exports = Router