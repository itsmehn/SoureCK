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
                    check: 0
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
    let { username, password } = req.body
    let result = validationResult(req)
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
                    const { JWT_SECRET } = process.env
                    jwt.sign({
                        id: account.id,
                        username: account.username

                    }, JWT_SECRET, {
                        expiresIn: '24h'
                    }, (err, token) => {
                        if (err) throw err
                        if (account.check == 0) {
                            return res.status(200).json({
                                code: 1,
                                message: 'Đăng nhập thành công đổi mật khẩu',
                                token: token,
                                data: account

                            })
                        } else {
                            return res.status(200).json({
                                code: 1,
                                message: 'Đăng nhập thành công',
                                token: token,
                                data: account

                            })
                        }

                    })

                } else {
                    return res.status(400).json({
                        code: 2,
                        message: 'Sai thông tin đăng nhập'

                    })
                }
            })
            .catch(e => {
                return res.status(400).json({
                    code: 2,
                    message: e.message

                })
            })

    } else {
        let messages = result.mapped()
        let message = ''

        for (fiels in messages) {
            message = messages[fiels]
            break
        }
        return res.status(400).json({ code: 1, message: message })
    }
}

const getFirstChangePass = (req, res) => {
    res.render('change-password-first')
}


const postFirstChangePass = (req, res, next) => {
    let { password, repassword } = req.body
    let id = mongoose.Types.ObjectId(takeID(req.headers.authorization).id)
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

const getProfilePage = (req, res) => {
    res.render('profile')
}

module.exports = {
    getProfilePage,
    getRegister,
    postRegister,
    getLogin,
    postLogin,
    getFirstChangePass,
    postFirstChangePass
}