const meRouter = require("./me")

function route(app){
    app.use('/me',meRouter)
}

module.exports = route;
