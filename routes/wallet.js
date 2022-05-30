const express = require('express');
const Router = express.Router();
const walletController = require('../controllers/wallet.controller')
const check = require('../middlewares/checkSession')
const checkWallet = require('../middlewares/checkWallet')

Router.get('/recharge',check,walletController.getRecharge)
Router.post('/recharge',check,checkWallet.mdwRecharge,walletController.postRecharge)
Router.get('/withdraw',check,walletController.getWithdraw)
Router.post('/withdraw',check,checkWallet.mdwWithdraw,walletController.postWithdraw)
Router.get('/transfer',check, walletController.getTransfer)
Router.post('/transfer',check,checkWallet.mdwTransfer,walletController.postTransfer)
Router.get('/buycard',check,walletController.getBuyCard)
Router.post('/buycard',check,checkWallet.mdwBuyCard,walletController.postBuyCard)
Router.get('/buycard-detail/:id',check,walletController.getBuyCardDetail)
Router.get('/transaction',check,walletController.getTransaction)
Router.get('/history-detail-transfer/:id',check,walletController.getDetailTransfer)
Router.get('/history-detail-recharge/:id',check,walletController.getDetailRecharge)
Router.get('/history-detail-withdraw/:id',check,walletController.getDetailWithdraw)
Router.get('/history-detail-buycard/:id',check,walletController.getDetailBuyCard)
module.exports = Router

