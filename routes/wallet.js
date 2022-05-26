const express = require('express');
const Router = express.Router();
const walletController = require('../controllers/wallet.controller')

Router.get('/recharge',walletController.getRecharge)
Router.post('/recharge/:id',walletController.postRecharge)
module.exports = Router