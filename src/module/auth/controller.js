const bcrypt = require('bcrypt');
const retorno = require('../../red/return');
const usuarioController = require('../usuario/index');

async function login(req, res, next) {
    try {
        const { username, password } = req.body;

        // console.log('Intentando iniciar sesión para el usuario:', username);

        // Obtener el usuario por el nombre de usuario
        const usuario = await usuarioController.getByField('username', username);

        // console.log('Usuario encontrado:', usuario);

        // Verificar si el usuario existe y la contraseña es válida
        if (usuario && await bcrypt.compare(password, usuario.password)) {
            // Autenticación exitosa
            retorno.success(req, res, 'Inicio de sesión exitoso', 200);
        } else {
            // Credenciales inválidas
            retorno.error(req, res, 'Credenciales inválidas', 401);
        }
    } catch (err) {
        // Manejar errores de inicio de sesión
        // console.error('Error en el inicio de sesión:', err);
        retorno.error(req, res, 'Error en el inicio de sesión', 500);
    }
}

module.exports = {
    login
};