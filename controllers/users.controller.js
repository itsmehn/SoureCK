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
const wallet = require('../models/wallet')





//API REGISTER
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
                    // EMAIL THÔNG BÁO ĐĂNG KÝ
                    // let messageOptions = {
                    //     from: 'sinhvien@phongdaotao.com',
                    //     to: email,
                    //     subject: "GỬI THÔNG TIN TÀI KHOẢN EWALLET",
                    //     text: ` Hi ${fullName},
                    //             Lời đầu tiên chúng tôi cảm ơn bạn đã tin tưởng sử dụng website. Chúng tôi gửi bạn thông tin đăng nhập website.
                    //             Username: ${username}
                    //             Password: ${password}
                    //             Mọi thông tin thắc mắc liên hệ gmail, số điện thoại của chúng tôi.
                    //             Trân trọng,
                    //             Đội ngũ Ewallet`
                    // };

                    return res.render('register', { account: { username, password, phoneNumber } })
                        // transporter.sendMail(messageOptions, (error, info) => {
                        //     if (error) {
                        //         console.log(error)
                        //     }
                        //     res.render('register', { account: { username, password } })
                        //     return res.redirect(`/users/createwallet/${phoneNumber}`)
                        // });
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

//API LOGIN
const getLogin = (req, res) => {
    if (req.session.account) {
        return res.redirect('/users/homepage')
    }
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
                    res.locals.account = account
                        // console.log(req.session.account)

                    if (account.check == 0) {
                        //Lần đầu tiên đăng nhập
                        return res.redirect('/users/first-change-pass')
                    } else {
                        return res.redirect('/users/homepage')
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

const getHomePage = async(req, res) => {
    if (req.session.account) {
        return res.redirect('/users/homepage')
    }
    res.render('home-page')
}
const getHomePageLogin = (req, res) => {
    if (!req.session.account) {
        return res.redirect('/users/login')
    }
    account = req.session.account
    res.render('home-page-login', { account: account })
}
const getLogout = (req, res) => {
        req.session = null
        res.redirect('/')
    }
    //API FIRST CHANGE PASSWORD
const getFirstChangePass = (req, res) => {

    res.render('change-password-first', { message: '' })
}


const postFirstChangePass = (req, res) => {
    let { password, repassword } = req.body
    let id = req.session.account._id
    if (!password || !repassword || password != repassword) {
        return res.render('change-password-first', { message: 'Mật khẩu chưa hợp lệ' })
    } else {
        dataUser.findByIdAndUpdate(id, { password: password, check: 1 }, {
                new: true
            })
            .then((account) => {
                req.session.account = account
                if (account) {
                    return res.redirect('/users/profile')
                } else return res.render('change-password-first', { message: '' });
            })
            .catch((e) => {
                return res.render('change-password-first', { message: '' });
            });

    }
}

//API GET PROFILE
const getProfile = async(req, res) => {
    res.locals.account = req.session.account
    let acc = req.session.account
    if (!acc) {
        return res.redirect('/users/login')
    }
    return res.render('profile', { acc: acc, message: ' ' })

}

//API CHANGE PASSWORD (1.6)
const getChangePass = (req, res) => {
    res.render('change-password', { message: '' })
}

const postChangePass = (req, res) => {
    let { oldpass, newpass, renewpass } = req.body

    if (oldpass != req.session.account.password) {
        return res.render('change-password', { message: 'Mật khẩu cũ không đúng' })
    } else if (newpass != renewpass) {

        return res.render('change-password', { message: 'Mật khẩu mới không khớp' })
    } else {
        dataUser.findByIdAndUpdate(req.session.account._id)
            .then(newpass => {
                return res.redirect('/users/profile')
            })
    }

}

const getCreatWallet = async(req, res) => {
    let id = req.params.id
    if (!id) {
        return res.redirect('/users/login')
    } else {
        await dataUser.findOne({ phoneNumber: id })
            .then((d) => {
                let userId = d._id
                let userWallett = new wallet({
                    userId: userId
                })
                userWallett.save();
            }).then(() => {
                return res.redirect('/users/login')
            }).catch(e => console.log(e))
    }
}

//changeCMND
const postProfile = (req, res) => {
    const imageFront = req.files.imageFront
    const imageBack = req.files.imageBack
        // console.log(req.files)
    let id = req.session.account._id
    dataUser.findByIdAndUpdate(id, { imageBack: imageBack[0].filename, imageFront: imageFront[0].filename }, {
            new: true
        })
        .then(account => {
            req.session.account = account
            if (account) {
                console.log("Thành công")
                return res.render('profile', { acc: account, message: '   ' })
            } else return res.render('profile', { message: 'Không thành công' })
        })

}

module.exports = {
    getProfile,
    getRegister,
    postRegister,
    getLogin,
    postLogin,
    getFirstChangePass,
    postFirstChangePass,
    getChangePass,
    postChangePass,
    getCreatWallet,
    postProfile,
    getHomePage,
    getLogout,
    getHomePageLogin
}