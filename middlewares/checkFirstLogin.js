const checkFirstLogin = (req, res, next) => {

    if (req.session.account && req.session.account.check === 0) {
        return res.redirect('/users/first-change-pass')
    }
    next()
}
module.exports = checkFirstLogin