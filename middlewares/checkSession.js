const checkSession = (req, res, next) => {
    if (!req.session.account) {
        return res.redirect('/users/login')
    }
    next()
}
module.exports = checkSession