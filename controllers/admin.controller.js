const dataUser = require('../models/users')
const mongoose = require('mongoose')
const { response } = require('express')


const getManagerAccount = async(req, res) => {
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

        console.log(listAccount)

        return res.json({
            code: 0,
            message: "success",
            listAccount: listAccount
        })
    }


}

const getAccount = async(req, res) => {
    const { id } = req.params

    let user;
    let errorMessage = ""
    await dataUser.findOne({ _id: id })
        .then(account => {
            user = account
        }).catch(err => {
            errorMessage = "Loi server"
        })

    return res.render("accoutnDetail", { account: user })
}

const accountDetail = async(req, res) => {
    const { id } = req.params

    let user;
    let errorMessage = ""
    await dataUser.findOne({ _id: id })
        .then(account => {
            user = account
        }).catch(err => {
            errorMessage = "Loi server"
        })

    // if (errorMessage.length === 0) {
    // return res.json()
    return res.json({
            code: 0,
            message: "success",
            account: user
        })
        // }
}

// middle ware check account => route
const activeAccount = async(req, res) => {
    const { phoneNumber } = req.query
    let user;
    let errorMessage = "";
    await dataUser.findOne({ phoneNumber: phoneNumber })
        .then(account => {
            if (account.check == 0 || account.check == 1) {
                user = account;
            } else {
                errorMessage = "Account k phu hop"
            }
        }).catch(err => {
            errorMessage = "Loi server"
        })

    if (err.length > 0) {
        await dataUser.updateOne({ phoneNumber: phoneNumber }, {
            check: 2
        })

        return res.json({
            code: 0,
            message: "Success"
        })

    } else {
        return res.json({
            code: 1,
            message: errorMessage
        })
    }
}

//v ohieu hoa
const rejectAccount = async(req, res) => {
    const { phoneNumber } = req.query
    let user;
    let errorMessage = "";
    await dataUser.findOne({ phoneNumber: phoneNumber })
        .then(account => {
            if (account.check != 4) {
                user = account;
            } else {
                errorMessage = "Account k phu hop"
            }
        }).catch(err => {
            errorMessage = "Loi server"
        })

    if (err.length > 0) {
        await dataUser.updateOne({ phoneNumber: phoneNumber }, {
            check: 4
        })

        return res.json({
            code: 0,
            message: "Success"
        })

    } else {
        return res.json({
            code: 1,
            message: errorMessage
        })
    }
}

//

module.exports = {
    getManagerAccount,
    // postManagerAccount,
    getAccount,
    accountDetail,
    activeAccount,
    rejectAccount
}