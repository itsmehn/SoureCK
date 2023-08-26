const dataUser = require('../models/users')
const mongoose = require('mongoose')
const { response } = require('express')
const transaction = require('../models/transaction')
const user = require('../models/users')
const wallet = require('../models/wallet')
const { consumers } = require('nodemailer/lib/xoauth2')
const getManagerAccount = async (req, res) => {
    res.locals.account = req.session.account
    let selectOption = req.query.status
    let listAccount;
    if (!selectOption) {
        await dataUser.find({ check: { $lt: 5 } }).sort({ check: 1, createAt: -1 })
            .then((accounts) => {

                return res.render('manager-account', { accounts: accounts })
            })
            .catch(e => {
                console.log(e)
            })
    } else {
        selectOption = Number(selectOption)

        if (selectOption == 0) {
            await dataUser.find({ check: { $lt: 5 } }).sort({ check: 1, createAt: -1 })
                .then((accounts) => {

                    listAccount = accounts
                })
                .catch(e => {
                    console.log(e)
                })
        } else if (selectOption == 1) {
            await dataUser.find({ check: { $lt: 2 } }).sort({ check: 1, createAt: -1 })
                .then((accounts) => {
                    listAccount = accounts
                    // return res.render('manager-account', { accounts: accounts })
                })
                .catch(e => {
                    console.log(e)
                })
        } else {
            await dataUser.find({ check: selectOption }).sort({ createAt: -1 })
                .then((accounts) => {
                    // console.log("accounts: ", accounts)
                    listAccount = accounts
                    // return res.render('manager-account', { accounts: accounts })
                    // return data
                    // return res.json({
                    //     code: 0,
                    //     message: "success",
                    //     accounts: accounts
                    // })
                })
                .catch(e => {
                    console.log(e)
                })
        }


        return res.json({
            code: 0,
            message: "success",
            listAccount: listAccount
        })
    }


}

const getAccount = async (req, res) => {
    res.locals.account = req.session.account
    let account = req.session.account
    let id = req.params.id
    console.log(id)
    let user;
    let errorMessage = ""
    let userTrans = await transaction.find({
        $or : [
            {userId:Object(id)},
            {recepientId: String(id)}
        ]
    }).sort({timeStamps: -1})
    user = await dataUser.findOne({ _id: id })
    
    return res.render("accoutnDetail", { account: user,userTrans:userTrans.slice(0,3) })
}

const activeAccount = async (req, res) => {
    let id = req.params.id
    console.log(id)
    dataUser.findByIdAndUpdate(id, { check: 2 })
        .then(user => {
            return res.json({
                code: 0,
                message: "success",
                account: user
            })
        })
}

//update ID Card
const updateIDCard = async (req, res) => {
    let id = req.params.id
    console.log(id)
    dataUser.findByIdAndUpdate(id, { checkIDCard: 1 })
        .then(user => {
            return res.json({
                code: 0,
                message: "success",
                account: user
            })
        })
}
//v ohieu hoa
const rejectAccount = async (req, res) => {
    let id = req.params.id

    dataUser.findByIdAndUpdate(id, { check: 4 })
        .then(user => {
            return res.json({
                code: 0,
                message: "success",
                account: user
            })
        })
}

//
const adGetTransaction = async (req, res) => {
    res.locals.account = req.session.account
    let account = req.session.account
    let userTrans = await transaction.find({
        $and: [
            {
                amount: { $gte: 5000000 }
            },
            {
                $or: [{
                    action: 'CT'
                }, {
                    action: 'RT'
                }]
            },
            {
                status: 'đang chờ'
            }
        ]
    }).sort({ timeStamps: -1 })
    res.render('transaction-approvals', { userTrans })
}
const getDetailTransfer = async (req, res) => {
    res.locals.account = req.session.account
    let id = req.params.id
    let transfer = await transaction.findOne({ codeTrans: id })
    let recepientId = transfer.recepientId
    let userReceiver = await user.findOne({ _id: Object(recepientId) })
    return res.render('transfer-approval-detail', { transfer, userReceiver })
}
const getDetailWithdraw = async (req, res) => {
    res.locals.account = req.session.account
    let id = req.params.id
    let withdraw = await transaction.findOne({ codeTrans: id })
    return res.render('withdraw-approval-detail', { withdraw })
}
const getAcceptTransfer = async (req, res) => {
    let id = req.params.id
    let UserTrans = await transaction.findOne({ codeTrans: id })
    let sendWallet = await wallet.findOne({ userId: Object(UserTrans.userId) })
    let receiverWallet = await wallet.findOne({ userId: Object(UserTrans.recepientId) })
    if (String(sendWallet.userId) === String(receiverWallet.userId)) {
        sendWallet.balance = sendWallet.balance - parseInt(UserTrans.fee)
        UserTrans.timeStamps = Date.now()
        UserTrans.status = 'Đã duyệt'
        UserTrans.save()
        sendWallet.save()
        return res.json({
            code: 0,
            message: 'success',
            UserTrans
        })
    } else {
        if (UserTrans.userFee == 0) {
            sendWallet.balance = parseInt(sendWallet.balance) - parseInt(UserTrans.amount) - parseInt(UserTrans.fee)
            receiverWallet.balance = parseInt(receiverWallet.balance) + parseInt(UserTrans.amount)

        } else {
            sendWallet.balance = parseInt(sendWallet.balance) - parseInt(UserTrans.amount)
            receiverWallet.balance = parseInt(receiverWallet.balance) + parseInt(UserTrans.amount) - parseInt(UserTrans.fee)

        }
        UserTrans.timeStamps = Date.now()
        UserTrans.status = 'Đã duyệt'
        sendWallet.save()
        receiverWallet.save()
        UserTrans.save()
        return res.json({
            code: 0,
            message: 'success',
            UserTrans
        })
    }
}
const getAcceptWithdraw = async (req, res) => {
    let id = req.params.id
    let UserTrans = await transaction.findOne({ codeTrans: id })
    if (!UserTrans) {
        return res.json({
            code: 1,
            message: 'Lỗi',
        })
    }
    let UserWallet = await wallet.findOne({ userId: Object(UserTrans.userId) })
    UserWallet.balance = parseInt(UserWallet.balance) - parseInt(UserTrans.amount) - parseInt(UserTrans.fee)
    UserTrans.timeStamps = Date.now()
    UserTrans.status = 'Đã duyệt'
    UserWallet.save()
    UserTrans.save()
    return res.json({
        code: 0,
        message: 'success',
        UserTrans
    })
}
const getReject = async (req, res) => {
    let id = req.params.id
    let userTrans = await transaction.findOne({ codeTrans: id })
    if (!userTrans) {
        return res.json({
            code: 1,
            message: 'Lỗi',
        })
    }else {
        userTrans.timeStamps = Date.now()
        userTrans.status = 'Hủy giao dịch'
        userTrans.save()
    return res.json({
        code: 0,
        message: 'success',
        userTrans
    })
    }
}
const unlockAccount = async (req, res) => {
    let id = req.params.id

    dataUser.findByIdAndUpdate(id, { check: 1 })
        .then(user => {
            return res.json({
                code: 0,
                message: "success",
                account: user
            })
        })
}

//check ID card

module.exports = {
    getManagerAccount,
    // postManagerAccount,
    getAccount,
    unlockAccount,
    activeAccount,
    rejectAccount,
    adGetTransaction,
    getDetailTransfer,
    getDetailWithdraw,
    getAcceptTransfer,
    getAcceptWithdraw,
    getReject,
    updateIDCard
}