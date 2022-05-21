const getProfilePage = async(req,res,next) =>{
    res.render('profile.ejs')
}

module.exports = {
    getProfilePage
}