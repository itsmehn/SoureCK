const dataUser = require('../models/users')
const mongoose = require('mongoose')


const getManagerAccount = (req, res) => {
    let selectOption = req.body.cars
    console.log(selectOption)
    dataUser.find({ check: { $lt: 5 } }).sort({ check: 1, createAt: -1 })
        .then((accounts) => {

            return res.render('manager-account', { accounts: accounts })
        })
        .catch(e => {
            console.log(e)
        })

}

const postManagerAccount = (req, res) => {
    let selectOption = req.body.cars
    console.log(selectOption)
    res.render('manager-account')
        // dataUser.find({ check: { $lt: 5 } }).sort({ check: 1, createAt: -1 })
        //     .then((accounts) => {

    //         return res.render('manager-account', { accounts: accounts })
    //     })
    //     .catch(e => {
    //         console.log(e)
    //     })

}



const getAccount = (req, res) => {
    res.render('chitietaccount1')
}

module.exports = {
    getManagerAccount,
    postManagerAccount,
    getAccount
}