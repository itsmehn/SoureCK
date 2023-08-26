const { check } = require('express-validator')

module.exports = [
    check('username')
    .exists().withMessage('Vui lòng nhập thông tin username')
    .notEmpty().withMessage('Vui lòng nhập thông tin username'),

    check('password')
    .exists().withMessage('Không được để trống mật khẩu')
    .notEmpty().withMessage('Không được để trống mật khẩu')

]