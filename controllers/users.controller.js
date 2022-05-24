const multer = require('multer')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const url = require('url')
var generator = require('generate-password');
var randomUsername = require('random-mobile');


const registerValidator = require('../middlewares/registerValidator')

const dataUser = require('../models/users')
const { Router } = require('express')

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },
    filename: function(req, file, callback) {
        callback(null, crypto.createHash('md5').update(Math.random().toString()).digest('hex') + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

const getProfilePage = async(req, res, next) => {
    res.render('profile.ejs')
}

var getRegister = (req, res) => {
    res.render('register')
}

var postRegister = async(req, res) => {
    let result = validationResult(req)
    let { phoneNumber, email, fullName, dateOfbirth, address } = req.body

    if (result.errors.length === 0) {

        dataUser.findOne({ phoneNumber: phoneNumber, email: email })
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
                if (phoneNumber == 10) {
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
                    imageBack: imageBack[0].filename
                })

                user.save().then(() => {
                    return res.status(200).json({
                        code: 0,
                        message: 'Đăng ký thành công',
                        data: user
                    })
                })

            })
            .catch(e => {
                return res.status(400).json({
                    code: 2,
                    message: 'Đăng ký thất bại ' + e.message

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

module.exports = {
    getProfilePage,
    getRegister,
    postRegister
}