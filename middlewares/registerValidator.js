const { check } = require('express-validator')

module.exports = [

    check('phoneNumber')
    .exists().withMessage('Vui lòng nhập số điện thoại')
    .notEmpty().withMessage('Không được để trống số điện thoại')
    .isNumeric().withMessage('Số điện thoại không hợp lệ'),

    check('email')
    .exists().withMessage('Vui lòng nhập email')
    .notEmpty().withMessage('Email không được để trống')
    .isEmail().withMessage('Email không hợp lệ'),

    check('fullName')
    .exists().withMessage('Vui lòng nhập họ và tên')
    .notEmpty().withMessage('Không được để trống họ và tên'),

    check('dateOfbirth')
    .exists().withMessage('Vui lòng nhập ngày sinh')
    .notEmpty().withMessage('Vui lòng không để trống ngày sinh'),

    check('address')
    .exists().withMessage('Vui lòng cung cấp địa chỉ')
    .notEmpty().withMessage('Vui lòng cung cấp địa chỉ'),

]