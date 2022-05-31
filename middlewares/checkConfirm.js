const checkConfirm = (req, res, next) => {
    if (req.session.account.check === 1) {
        return res.redirect('/users/profile')
    }
    next()
}
module.exports = checkConfirm