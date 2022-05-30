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


        return res.json({
            code: 0,
            message: "success",
            listAccount: listAccount
        })
    }


}

const getAccount = async(req, res) => {
    res.locals.account = req.session.account

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

const activeAccount = async(req, res) => {
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
const updateIDCard = async(req, res) => {
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
const rejectAccount = async(req, res) => {
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

const unlockAccount = async(req, res) => {
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
    updateIDCard
}