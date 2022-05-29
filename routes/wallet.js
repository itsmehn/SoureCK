const express = require('express');
const Router = express.Router();
const walletController = require('../controllers/wallet.controller')
const check = require('../middlewares/checkSession')
const checkWallet = require('../middlewares/checkWallet')

Router.get('/recharge',check,walletController.getRecharge)
Router.post('/recharge',checkWallet.mdwRecharge,walletController.postRecharge)
Router.get('/withdraw',check,walletController.getWithdraw)
Router.post('/withdraw/:id',walletController.postWithdraw)
Router.get('/transfers',check, walletController.getTransfer)
Router.post('/transfers/:id',walletController.postTransfer)
Router.get('/buycard',check,walletController.getBuyCard)
Router.post('/buycard/:id',walletController.postBuyCard)
Router.get('/transaction/:id',check,walletController.getTransaction)
module.exports = Router