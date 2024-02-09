const myqsl = require('mysql2');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

let conexion;

function conexionMysql(){
    conexion = myqsl.createConnection(dbconfig);

    conexion.connect((err) => {
        if(err){
            console.log('[db err]', err);
            setTimeout(conexionMysql, 200);
        }else{
            console.log('DB conectada!!!');
        }
    });

    conexion.on('error', err => {
        console.log('[db err]', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            conexionMysql();
        }else{
            throw err;
        }
    })
}

conexionMysql();

function obtenerTodos(tabla){
    return new Promise((resolve, reject) => {
        conexion.query(`Select * from ${tabla}`, (error, result) => {
            if(error) return reject(error);
            resolve(result);
        })
    })
}

function obtenerPorId(tabla, id){
    const idColumn = `id_${tabla.replace(/^.*\./, '')}`;
    return new Promise((resolve, reject) => {
        conexion.query(`Select * from ${tabla} WHERE ${idColumn} = ${id}`, (error, result) => {
            if(error) return reject(error);
            resolve(result);
        })
    })
}

function agregar(tabla, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`INSERT INTO ${tabla} SET ?`, data, (error, result) => {
            if (error) {
                console.error('Error al insertar:', error);
                return reject(error);
            }
            console.log('Inserción exitosa:', result);
            resolve(result);
        });
    });
}

function actualizar(tabla, id, newData) {
    const idColumn = `id_${tabla.replace(/^.*\./, '')}`;
    return new Promise((resolve, reject) => {
        conexion.query(`UPDATE ${tabla} SET ? WHERE ${idColumn} = ?`, [newData, id], (error, result) => {
            if (error) {
                // console.error('Error al actualizar:', error);
                return reject(error);
            }

            if (result.affectedRows > 0) {
                // console.log('Actualización exitosa:', result);
                resolve(result);
            } else {
                // console.error(`No se encontró ninguna fila para actualizar con ${idColumn}=${id}`);
                reject(new Error(`No se encontró ninguna fila para actualizar con ${idColumn}=${id}`));
            }
        });
    });
}

function eliminar(tabla, id) {
    const idColumn = `id_${tabla.replace(/^.*\./, '')}`;
    // console.log('Intentando eliminar:', idColumn, id);
    return new Promise((resolve, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE ${idColumn} = ?`, id, (error, result) => {
            if (error) {
                // console.error('Error en la consulta DELETE:', error);
                return reject(error);
            }

            if (result.affectedRows > 0) {
                // console.log('Eliminación exitosa:', result);
                resolve(result);
            } else {
                // console.error(`No se encontró ninguna fila para eliminar con ${idColumn}=${id}`);
                reject(new Error(`No se encontró ninguna fila para eliminar con ${idColumn}=${id}`));
            }
        });
    });
}

module.exports = {
    conexion,
    obtenerTodos,
    obtenerPorId,
    agregar,
    actualizar,
    eliminar
}