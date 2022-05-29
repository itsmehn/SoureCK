const checkSession = (req, res, next) => {
    if (!req.session) {
        return res.redirect('/users/login')
    }
    next()
}
module.exports = checkSession