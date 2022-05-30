const dataUser = require('../models/users')
const mongoose = require('mongoose')


const getManagerAccount = (req, res) => {
    const users = []
    dataUser.find({ check: { $lt: 5 } }).sort({ check: 1, createAt: -1 })
        .then((accounts) => {
            console.log(accounts.length)
            return res.render('manager-account', { accounts: accounts })
        })
        .catch(e => {
            console.log(e)
        })

}

module.exports = {
    getManagerAccount
}