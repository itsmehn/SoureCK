const checkAdmin = (req, res, next) => {

    if (req.session.account && req.session.account.role == 'admin') {
        return res.redirect('/admin/manageraccount')
    }
    next()
}
module.exports = checkAdmin