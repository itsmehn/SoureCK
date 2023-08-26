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
Router.get('/detail-withdraw/:id',isAdmin,adminController.getDetailWithdraw)
Router.get('/acceptTransfer/:id',isAdmin,adminController.getAcceptTransfer)
Router.get('/acceptWithdraw/:id',isAdmin,adminController.getAcceptWithdraw)
Router.get('/reject/:id',isAdmin,adminController.getReject)
Router.get('/account/active/:id', isAdmin, adminController.activeAccount)
Router.get('/account/updateIDCard/:id', isAdmin, adminController.updateIDCard)
Router.get('/account/reject/:id', isAdmin, adminController.rejectAccount)
Router.get('/account/unlock/:id', isAdmin, adminController.unlockAccount)
module.exports = Router