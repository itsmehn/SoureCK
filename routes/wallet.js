const express = require('express');
const Router = express.Router();
const walletController = require('../controllers/wallet.controller')

Router.get('/recharge',walletController.getRecharge)
Router.post('/recharge/:id',walletController.postRecharge)
Router.get('/withdraw',walletController.getWithdraw)
Router.post('/withdraw/:id',walletController.postWithdraw)
Router.get('/transfers', walletController.getTransfer)
Router.post('/transfers/:id',walletController.postTransfer)
Router.get('/buycard',walletController.getBuyCard)
Router.post('/buycard/:id',walletController.postBuyCard)
module.exports = Router