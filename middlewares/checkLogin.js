const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {
    let authorization = req.header('Authorization')
    if (!authorization) {
        return res.status(401)
            .json({ code: 101, message: 'Vui lòng cấp token qua header' })
    }
    let token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401)
            .json({ code: 101, message: 'Vui lòng nhập token jwt hợp lệ' })
    } else {
        const { JWT_SECRET } = process.env

        jwt.verify(token, JWT_SECRET, (error, data) => {
            if (error) {
                return res.status(401)
                    .json({ code: 101, message: 'Token không tồn tại hoặc đã hết hạn' })
            }
            req.data
            next()
        })
    }
}