const dataUser = require('../models/users')
const mongoose = require('mongoose')


const getManagerAccount = async(req, res) => {
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

const getAccount = (req, res) => {
    res.render('chitietaccount1')
}

module.exports = {
    getManagerAccount,
    // postManagerAccount,
    getAccount
}