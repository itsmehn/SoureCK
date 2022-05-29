const { check } = require('express-validator')


const mdwRecharge = [
    check('soThe')
    .exists().withMessage('Vui lòng nhập số thẻ')
    .notEmpty().withMessage('Vui lòng nhập số thẻ'),

    check('deadline')
    .exists().withMessage('Vui lòng nhập ngày hết hạn')
    .notEmpty().withMessage('Vui lòng nhập ngày hết hạn'),
    check('cvvCode')
    .exists().withMessage('Vui lòng nhập mã CVV')
    .notEmpty().withMessage('Vui lòng nhập mã CVV'),

    check("amount")
    .exists().withMessage('Vui lòng nhập số tiền')
    .notEmpty().withMessage('Vui lòng nhập số tiền')
    .isNumeric().withMessage('Vui lòng không nhập sai số tiền')

]

module.exports = {
    mdwRecharge
}