const express = require("express");
const mongoose = require("mongoose");
const Router = express.Router()
const DataUser = require('../models/users')
const registerValidator = require('../middlewares/registerValidator')
const userController = require('../controllers/users.controller');
const upload = require("../middlewares/uploads")
const loginValidator = require('../middlewares/loginValidator');
const check = require('../middlewares/checkSession')
const checkFirstLogin = require('../middlewares/checkFirstLogin')
const isAdmin = require('../middlewares/checkAdmin')
Router.get('/register', userController.getRegister)
Router.post('/register',
    upload.fields([{ name: 'imageFront', maxCount: 1 }, { name: 'imageBack', maxCount: 1 }]),
    // upload.single("image"),
    registerValidator,
    userController.postRegister)

Router.get('/login', userController.getLogin)
Router.get('/homepage', check, checkFirstLogin, userController.getHomePageLogin)
Router.post('/login', userController.postLogin)
Router.get('/first-change-pass', check, userController.getFirstChangePass)
Router.post('/first-change-pass', check, userController.postFirstChangePass)
Router.get("/profile", check, checkFirstLogin, userController.getProfile)
Router.get("/changepassword", check, checkFirstLogin, userController.getChangePass)
Router.post("/changepassword", check, userController.postChangePass)
Router.get("/createwallet/:id", userController.getCreatWallet)
Router.post('/profile', check, upload.fields([{ name: 'imageFront', maxCount: 1 }, { name: 'imageBack', maxCount: 1 }]), userController.postProfile)
Router.get('/forgetpassword', userController.getOTP)
Router.get('/getOTP', userController.getForgetPassword)
Router.post('/forgetpassword', userController.postOTP)
Router.get('/changenewpass/:phoneNumber', userController.getchangenewpass)
Router.post('/changenewpass/:phoneNumber', userController.postchangenewpass)

module.exports = Router