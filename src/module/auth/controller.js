const bcrypt = require('bcrypt');
const retorno = require('../../red/return');
const usuarioController = require('../usuario/index');
const jwtService = require('../../autenticacion');

async function login(req, res, next) {
    try {
        const { username, password } = req.body;

        // console.log('Intentando iniciar sesión para el usuario:', username);
        const usuario = await usuarioController.getByField('username', username);

        // console.log('Usuario encontrado:', usuario);

        // Generar el JWT
        const token = jwtService.asignarToken({
            id_usuario: usuario.id_usuario,
            username: usuario.username,
            rol: usuario.rol,
        });

        if (usuario && await bcrypt.compare(password, usuario.password)) {
            retorno.success(req, res, { token }, 200);
        } else {
            retorno.error(req, res, 'Credenciales inválidas', 401);
        }
    } catch (err) {
        // console.error('Error en el inicio de sesión:', err);
        retorno.error(req, res, 'Error en el inicio de sesión', 500);
    }
}

module.exports = {
    login
};