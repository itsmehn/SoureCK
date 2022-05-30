const express = require("express");
const mongoose = require("mongoose");
const Router = express.Router()
const isAdmin = require('../middlewares/isAdmin')

const adminController = require('../controllers/admin.controller')

Router.get('/manageraccount', isAdmin, adminController.getManagerAccount)
    // Router.post('/manageraccount', adminController.postManagerAccount)
    // Router.get('/account', adminController.getAccount)
Router.get('/account/:id', isAdmin, adminController.getAccount)

module.exports = Router