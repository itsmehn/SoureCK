const mongoose = require('mongoose')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const url = require('url')
const generator = require('generate-password');
const randomUsername = require('random-mobile');
const transporter = require("../middlewares/sendMail")
const takeID = require('../middlewares/takeID')
const registerValidator = require('../middlewares/registerValidator')

const dataUser = require('../models/users')
const { Router } = require('express')
const { match } = require('assert')
const session = require('express-session')

const getRegister = (req, res) => {
    res.render('register', { phoneNumber: '', email: '', fullName: '', dateOfbirth: '', address: '', message: '' })
}

const postRegister = async(req, res) => {
    let result = validationResult(req)
    let { phoneNumber, email, fullName, dateOfbirth, address } = req.body

    if (result.errors.length === 0) {

        dataUser.findOne({ $or: [{ phoneNumber: phoneNumber }, { email: email }] })
            .then(account => {
                if (account) {
                    throw new Error('Tài khoản đã tồn tại')
                }
            })
            .then(() => {
                var password = generator.generate({
                    length: 6,
                    numbers: true
                });
                let username
                if (phoneNumber.length == 10) {
                    username = phoneNumber
                } else { username = randomUsername(); }

                const imageFront = req.files.imageFront
                const imageBack = req.files.imageBack

                let user = new dataUser({
                    phoneNumber: phoneNumber,
                    email: email,
                    fullName: fullName,
                    dateOfbirth: dateOfbirth,
                    address: address,
                    password: password,
                    username: username,
                    imageFront: imageFront[0].filename,
                    imageBack: imageBack[0].filename,
                    check: 0,
                    checkLoginFail: 0
                })

                user.save().then(() => {

                    let messageOptions = {
                        from: 'sinhvien@phongdaotao.com',
                        to: email,
                        subject: "GỬI THÔNG TIN TÀI KHOẢN EWALLET",
                        text: ` Hi ${fullName},
                                Lời đầu tiên chúng tôi cảm ơn bạn đã tin tưởng sử dụng website. Chúng tôi gửi bạn thông tin đăng nhập website.
                                Username: ${username}
                                Password: ${password}
                                Mọi thông tin thắc mắc liên hệ gmail, số điện thoại của chúng tôi.
                                Trân trọng,
                                Đội ngũ Ewallet`
                    };


                    transporter.sendMail(messageOptions, (error, info) => {
                        if (error) {
                            console.log(error)
                        }
                        res.redirect('/login')
                    });
                })

            })
            .catch(e => {
                return res.render('register', { phoneNumber: '', email: '', fullName: '', dateOfbirth: '', address: '', message: e.message })
            })

    } else {
        let messages = result.mapped()
        let message = ''

        for (fiels in messages) {
            message = messages[fiels]
            break
        }

        return res.render('register', { phoneNumber: phoneNumber, email: email, fullName: fullName, dateOfbirth: dateOfbirth, address: address, message: message.msg })
    }


}

const getLogin = (req, res) => {
    res.render('login', { username: '', password: '', message: '' })
}

const postLogin = (req, res) => {
    let result = validationResult(req)
    let { username, password } = req.body

    if (result.errors.length === 0) {

        dataUser.findOne({ username: username })
            .then(acc => {
                if (!acc) {
                    throw new Error('Tài khoản không tồn tại')
                } else {
                    account = acc
                    m = 0
                    if (acc.password === password) {
                        m = 1
                    }

                }

            })
            .then(() => {
                if (m == 1) {
                    req.session.account = account
                    if (account.check == 0) {

                        console.log(req.session.account)
                        return res.redirect('/users/first-change-pass')
                    } else {
                        return res.redirect('/')
                    }



                } else {
                    return res.render('login', { message: 'Sai thông tin đăng nhập' })
                }
            })
            .catch(e => {
                return res.render('login', { message: e.message })
            })

    } else {
        let messages = result.mapped()
        let message = ''

        for (fiels in messages) {
            message = messages[fiels]
            break
        }
        return res.render('login', { message: message.msg })
    }
}

const getFirstChangePass = (req, res) => {
    res.render('change-password-first')
}


const postFirstChangePass = (req, res, next) => {
    let { password, repassword } = req.body
    let id = req.session.account._id

    if (!password || !repassword || password != repassword) {
        return res.status(400).json({
            code: 2,
            message: 'Mật khẩu chưa khớp'

        })
    } else {
        dataUser.findByIdAndUpdate(id, { password: password, check: 1 }, {
                new: true
            })
            .then((account) => {
                if (account) {
                    return res.status(200).json({
                        code: 0,
                        message: 'Thành công',
                        data: account
                    })
                } else return res.json({ code: 2, message: "Không tìm được tài khoản" });
            })
            .catch((e) => {
                return res.json({ code: 3, message: "Đây không phải id hợp lệ" });
            });

    }
}

const getProfile = (req, res) => {
    console.log(req.session.account)
    let id = req.session.account._id
    if (!id) {
        res.redirect('/users/login')
    }
    dataUser.findOne({ id: id })
        .then(acc => {
            res.render('profile', { acc: acc })
        })
        .catch(err => {
            res.redirect('/error')
        })

}

const putLogin = (req, res) => {

}

module.exports = {
    getProfile,
    getRegister,
    postRegister,
    getLogin,
    postLogin,
    getFirstChangePass,
    postFirstChangePass
}