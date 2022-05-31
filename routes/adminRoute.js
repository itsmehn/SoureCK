const express = require("express");
const mongoose = require("mongoose");
const Router = express.Router()
const isAdmin = require('../middlewares/isAdmin')

const adminController = require('../controllers/admin.controller')

Router.get('/manageraccount', isAdmin, adminController.getManagerAccount)
    // Router.post('/manageraccount', adminController.postManagerAccount)
    // Router.get('/account', adminController.getAccount)
Router.get('/account/:id', isAdmin, adminController.getAccount)

Router.get('/approvals',isAdmin,adminController.adGetTransaction)
Router.get('/detail-transfer/:id',isAdmin,adminController.getDetailTransfer)
Router.get('/accept/:id',isAdmin,adminController.getAccept)
Router.get('/reject/:id',isAdmin,adminController.getReject)
module.exports = Router