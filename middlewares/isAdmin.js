const isAdmin = (req, res, next) => {
    if (!req.session.account) {
        return res.redirect("/users/login")
    } else {
        if (req.session.account.role === 'admin') {
            next()
        } else {
            return res.redirect("/")
        }
    }
}
module.exports = isAdmin