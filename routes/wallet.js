const express = require('express');
const Router = express.Router();
const walletController = require('../controllers/wallet.controller')
const check = require('../middlewares/checkSession')
const checkWallet = require('../middlewares/checkWallet')
const checkConfirm = require('../middlewares/checkConfirm')

Router.get('/recharge',check,checkConfirm,walletController.getRecharge)
Router.post('/recharge',check,checkConfirm,checkWallet.mdwRecharge,walletController.postRecharge)
Router.get('/withdraw',check,checkConfirm,walletController.getWithdraw)
Router.post('/withdraw',check,checkConfirm,checkWallet.mdwWithdraw,walletController.postWithdraw)
Router.get('/transfer',check,checkConfirm, walletController.getTransfer)
Router.post('/transfer',check,checkConfirm,checkWallet.mdwTransfer,walletController.postTransfer)
Router.get('/buycard',check,checkConfirm,walletController.getBuyCard)
Router.post('/buycard',check,checkConfirm,checkWallet.mdwBuyCard,walletController.postBuyCard)
Router.get('/buycard-detail/:id',check,checkConfirm,walletController.getBuyCardDetail)
Router.get('/transaction',check,checkConfirm,walletController.getTransaction)
Router.get('/history-detail-transfer/:id',check,checkConfirm,walletController.getDetailTransfer)
Router.get('/history-detail-recharge/:id',check,checkConfirm,walletController.getDetailRecharge)
Router.get('/history-detail-withdraw/:id',check,checkConfirm,walletController.getDetailWithdraw)
Router.get('/history-detail-buycard/:id',check,checkConfirm,walletController.getDetailBuyCard)
module.exports = Router

