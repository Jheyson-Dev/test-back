const jwt = require('jsonwebtoken');
const config = require('../config');
const error = require('../middleware/errors')

const secret = config.jwt.secret;

function asignarToken(data) {
    try {
        const payload = {
            usuarioId: data.id_usuario,
            username: data.username,
            rol: data.rol,
        };

        const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // tiempo de expiración

        return token;
    } catch (error) {
        console.error('Error al firmar el token:', error);
        throw error;
    }
}

function verificarToken(token){
    return jwt.verify(token, secret);
}

const examinarToken = {
    confirmarToken: function(req){
        decodificarCabecera(req);
    }
}

function obetenerToken(autorizacion){
    if(!autorizacion){
        throw error('No hay token', 401);
    }
    if(autorizacion.indexOf('Bearer') === -1){
        throw error('Formato invalido', 401)
    }
    let token = autorizacion.replace('Bearer ','')
    return token;
}

function decodificarCabecera(req){
    const autorizacion = req.headers.authorization || '';
    const token  = obetenerToken(autorizacion);
    const decodificado = verificarToken(token);

    req.user = decodificado;
}

module.exports = {
    asignarToken,
    examinarToken
};