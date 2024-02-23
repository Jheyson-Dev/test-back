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


async function obtenerDatosParaAdmin() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
      m.nombre AS nombre_marca_auto,
      mo.nombre AS nombre_modelo_auto,
      p.nombre AS nombre_producto,
      p.codigo_interno,
      p.codigo_OEM,
      p.codigo_fabricante,
      p.descripcion,
      p.multiplos,
      po.nombre AS nombre_pais_origen,
      COALESCE(i.stock, 0) AS stock,
      COALESCE(t.nombre, '') AS nombre,
      p.precio,
      COALESCE(im.url, '') AS url,
      COALESCE(o.descuento, 0) AS descuento
    FROM
      producto p
      LEFT JOIN modelo_auto mo ON p.id_modelo_auto = mo.id_modelo_auto
      LEFT JOIN marca_auto m ON mo.id_marca_auto = m.id_marca_auto
      LEFT JOIN pais_origen po ON p.id_pais_origen = po.id_pais_origen
      LEFT JOIN inventario i ON p.id_producto = i.id_producto
      LEFT JOIN tienda t ON i.id_tienda = t.id_tienda
      LEFT JOIN img_producto im ON p.id_producto = im.id_producto
      LEFT JOIN oferta o ON p.id_producto = o.id_producto;`;
  
      conexion.query(query, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
}

async function obtenerDatosParaWorker() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
      m.nombre AS nombre_marca_auto,
      mo.nombre AS nombre_modelo_auto,
      mo.anio_inicio,
      mo.anio_termino,
      p.nombre AS nombre_producto,
      p.descripcion,
      po.nombre AS nombre_pais_origen,
      mf.nombre AS nombre_marca_fabricante,
      p.codigo_interno,
      p.precio,
      COALESCE(i.stock, 0) AS stock,
      COALESCE(im.url, '') AS url,
      COALESCE(o.descuento, 0) AS descuento
    FROM
      producto p
      LEFT JOIN modelo_auto mo ON p.id_modelo_auto = mo.id_modelo_auto
      LEFT JOIN marca_auto m ON mo.id_marca_auto = m.id_marca_auto
      LEFT JOIN pais_origen po ON p.id_pais_origen = po.id_pais_origen
      LEFT JOIN marca_fabricante mf ON p.id_marca_fabricante = mf.id_marca_fabricante
      LEFT JOIN inventario i ON p.id_producto = i.id_producto
      LEFT JOIN img_producto im ON p.id_producto = im.id_producto
      LEFT JOIN oferta o ON p.id_producto = o.id_producto;`;
  
      conexion.query(query, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
}
  
async function buscarDatosRelacionados(query) {
    return new Promise((resolve, reject) => {
      const searchQuery = `SELECT
      p.nombre AS nombre_producto,
      p.descripcion,
      p.codigo_interno,
      p.precio,
      m.nombre AS nombre_marca_auto,
      mo.nombre AS nombre_modelo_auto,
      mo.anio_inicio,
      mo.anio_termino,
      po.nombre AS nombre_pais_origen,
      mf.nombre AS nombre_marca_fabricante,
      i.stock,
      t.nombre AS nombre_tienda
  FROM
      producto p
  JOIN
      modelo_auto mo ON p.id_modelo_auto = mo.id_modelo_auto
  JOIN
      marca_auto m ON mo.id_marca_auto = m.id_marca_auto
  JOIN
      pais_origen po ON p.id_pais_origen = po.id_pais_origen
  JOIN
      marca_fabricante mf ON p.id_marca_fabricante = mf.id_marca_fabricante
  JOIN
      inventario i ON p.id_producto = i.id_producto
  JOIN
      tienda t ON i.id_tienda = t.id_tienda
  WHERE
      p.nombre LIKE '%tu_busqueda%';'`;
  
      conexion.query(searchQuery, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
}

module.exports = {
    conexion,
    obtenerTodos,
    obtenerPorId,
    agregar,
    actualizar,
    eliminar,
    obtenerDatosParaAdmin,
    buscarDatosRelacionados,
    obtenerDatosParaWorker
}