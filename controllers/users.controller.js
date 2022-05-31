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
const messagebird = require('messagebird')('sZsABWoTXmtk2HNjnbLcohPeO');
const dataOTP = require('../models/otp')
const loginFail = require('../models/loginFail')

const dataUser = require('../models/users')
const { Router } = require('express')
const { match } = require('assert')
const session = require('express-session')
const wallet = require('../models/wallet')
const { nextTick } = require('process')
const otp = require('../models/otp')





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
                console(e)
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

const postLogin = async(req, res) => {
    let result = validationResult(req)
    let { username, password } = req.body
    if (result.errors.length === 0) {
        loginFail.findOne({ username: username })
            .then(acc => {
                if (acc) {

                    return res.render('login', { message: 'Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút' })
                }
            })
            .then(() => {
                dataUser.findOne({ username: username })
                    .then(acc => {
                        if (!acc) {
                            throw new Error('Tài khoản không tồn tại')
                        } else {

                            account = acc

                            if (acc.check == 4) {

                                return res.render('login', { message: 'Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008' })
                            } else if (acc.password === password) {
                                req.session.account = account
                                res.locals.account = account
                                dataUser.findByIdAndUpdate(req.session.account._id, { countLogin: 0, checkLoginFail: 0 }, {
                                    new: true
                                })
                                if (account.check == 0) {
                                    //Lần đầu tiên đăng nhập
                                    return res.redirect('/users/first-change-pass')
                                } else {
                                    return res.redirect('/users/homepage')
                                }
                            } else {
                                console.log(account.countLogin)
                                if (account.countLogin < 2) {

                                    dataUser.findByIdAndUpdate(account._id, { countLogin: account.countLogin + 1, loginFailAt: Date.now() }, {
                                            new: true
                                        })
                                        .then(acc => {
                                            return res.render('login', { message: 'Sai thông tin đăng nhập' })
                                        })

                                } else {
                                    dataUser.findByIdAndUpdate(account._id, { countLogin: account.countLogin - 2 }, {
                                        new: true
                                    })
                                    let loginfail = new loginFail({
                                        username: account.username
                                    })
                                    loginfail.save().then(() => {

                                        return res.render('login', { message: 'Sai thông tin đăng nhập' })


                                    })
                                }
                            }
                        }
                    })

                .catch(e => {
                    console.log(e)
                })
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
    let idWallet = acc._id
    console.log(idWallet)
    let userWallet = await wallet.findOne({ userId: Object(idWallet) })
    return res.render('profile', { acc: acc, message: ' ', userWallet })

}

//API CHANGE PASSWORD (1.6)
const getChangePass = (req, res) => {
    res.render('change-password', { message: '' })
}

const postChangePass = (req, res) => {
    res.locals.account = req.session.account
    let { oldpass, newpass, renewpass } = req.body

    if (oldpass != req.session.account.password) {
        return res.render('change-password', { message: 'Mật khẩu cũ không đúng' })
    } else if (newpass != renewpass) {

        return res.render('change-password', { message: 'Mật khẩu mới không khớp' })
    } else {
        dataUser.findByIdAndUpdate(req.session.account._id, { password: password })
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
const postProfile = async(req, res) => {
    const imageFront = req.files.imageFront
    const imageBack = req.files.imageBack
    let acc = req.session.account
    let idWallet = acc._id

    let userWallet = await wallet.findOne({ userId: Object(idWallet) })
        // console.log(req.files)
    let id = req.session.account._id
    dataUser.findByIdAndUpdate(id, { checkIDCard: 0, imageBack: imageBack[0].filename, imageFront: imageFront[0].filename }, {
            new: true
        })
        .then(account => {
            req.session.account = account
            if (account) {
                console.log("Thành công")
                return res.render('profile', { acc: account, message: '   ', userWallet })
            } else return res.render('profile', { message: 'Không thành công' })
        })

}



//API FORGET PASSWORD
const getForgetPassword = (req, res) => {
    let phoneNumber = req.query.phoneNumber
    let phoneNumber1 = phoneNumber.substr(1)
    phoneNumber1 = '+84' + phoneNumber1
    console.log(phoneNumber)
    let otp = Math.floor(100000 + Math.random() * 900000)
    dataUser.findOne({ phoneNumber: phoneNumber })
        .then(() => {
            var params = {
                'originator': 'TestMessage',
                'recipients': [
                    phoneNumber1
                ],
                'body': 'Your OTP ' + otp
            };
            let otps = new dataOTP({
                phoneNumber: account.phoneNumber,
                otp: otp
            })
            otps.save()
            messagebird.messages.create(params, function(err, response) {
                if (err) {
                    return console.log(err);
                }
                console.log(response);
            });
        })
}


const postOTP = (req, res) => {
    let { phoneNumber, otp } = req.body
    dataOTP.findOne({ phoneNumber: phoneNumber })
        .then(account => {

            if (account.otp == otp) {
                console.log("DONE")
                return res.redirect(`/users/changenewpass/${phoneNumber}`)
            } else {
                return res.render('forget-password', { message: 'Nhập sai mã OTP' })
            }
        }).catch(e => {
            return res.render('forget-password', { message: 'Nhập sai mã OTP' })
        })
}

const getchangenewpass = (req, res) => {

    res.render('change-password-first', { message: '' })
}

const postchangenewpass = (req, res) => {
    let { password, repassword } = req.body
    let phone = req.params.phoneNumber
    if (!password || !repassword || password != repassword) {
        return res.render('change-password-first', { message: 'Mật khẩu chưa hợp lệ' })
    } else {
        dataUser.findOneAndUpdate({ phoneNumber: phone }, { password: password }, {
                new: true
            })
            .then((account) => {
                if (account) {
                    return res.redirect('/users/login')
                } else return res.render('change-password-first', { message: '' });
            })
    }
}

const getOTP = (req, res) => {
        res.render('forget-password', { message: '' })
    }
    //END API FORGET PASSWORD

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
    getHomePageLogin,
    getForgetPassword,
    getOTP,
    postOTP,
    getchangenewpass,
    postchangenewpass
}