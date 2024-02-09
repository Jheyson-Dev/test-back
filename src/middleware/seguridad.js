const auth = require("../autenticacion")

module.exports = function verificarAuth(){
    function middleware(req, res, next){
        auth.examinarToken.confirmarToken(req)
        next();
    }

    return middleware
}