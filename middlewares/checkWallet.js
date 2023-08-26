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
const mdwWithdraw = [
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
    .isNumeric().withMessage('Vui lòng không nhập sai số tiền'),

    check('description')
    .exists().withMessage('Vui lòng nhập nội dung')
    .notEmpty().withMessage('Vui lòng nhập nội dung')

]
const mdwTransfer = [
    check('numReceiver')
    .exists().withMessage('Vui lòng nhập số thẻ')
    .notEmpty().withMessage('Vui lòng nhập số thẻ')
    .isNumeric().withMessage('Vui lòng nhập sđt'),

    check('desc')
    .exists().withMessage('Vui lòng nhập nội dung')
    .notEmpty().withMessage('Vui lòng nhập nội dung'),

    
    check("amount")
    .exists().withMessage('Vui lòng nhập số tiền')
    .notEmpty().withMessage('Vui lòng nhập số tiền')
    .isNumeric().withMessage('Vui lòng không nhập sai số tiền')


]
const mdwBuyCard = [
    check('nha_mang')
    .exists().withMessage('Vui lòng chọn nhà mạng')
    .notEmpty().withMessage('Vui lòng chọn nhà mạng'),

    check('menh_gia')
    .exists().withMessage('Vui lòng nhập mệnh giá')
    .notEmpty().withMessage('Vui lòng nhập mệnh giá'),

    
    check("qty")
    .exists().withMessage('Vui lòng chọn số lượng')
    .notEmpty().withMessage('Vui lòng chọn số lượng')
    .isNumeric().withMessage('Vui lòng chọn số lượng')
]

module.exports = {
    mdwRecharge,
    mdwWithdraw,
    mdwTransfer,
    mdwBuyCard
}