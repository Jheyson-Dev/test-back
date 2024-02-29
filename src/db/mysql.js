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

function agregarConStock(tabla, data) {
    conexion.query(`INSERT INTO ${tabla} SET ?`, data, (error, result) => {
        if (error) {
            console.error('Error al insertar ingreso:', error);
            throw error;
        }
        const { cantidad, id_producto } = data;
        conexion.query(
            `UPDATE producto SET stock = stock + ? WHERE id_producto = ?`,
            [cantidad, id_producto],
            (updateError, updateResult) => {
                if (updateError) {
                    console.error('Error al actualizar stock del producto:', updateError);
                    throw updateError;
                }

                console.log('Inserción de ingreso y actualización de stock exitosas');
            }
        );
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


async function actualizarConStock(tabla, id, newData) {
    const idColumn = `id_${tabla.replace(/^.*\./, '')}`;
    const [ingresoAnterior] = await obtenerPorId(tabla, id);
    const cantidadAnterior = ingresoAnterior.cantidad;
    const nuevaCantidad = newData.cantidad;
    const diferenciaCantidad = nuevaCantidad - cantidadAnterior;
    const idProductoAnterior = ingresoAnterior.id_producto;
    const idProductoNuevo = newData.id_producto;
    const idProductoCambiado = idProductoAnterior !== idProductoNuevo;

    if (diferenciaCantidad === 0 && idProductoCambiado) {
        console.log('No se pudo realizar la acción. La cantidad del ingreso no ha cambiado y se ha cambiado el ID del producto.');
        return;
    }
    const esAumento = diferenciaCantidad > 0;
    const cantidadAbsoluta = Math.abs(diferenciaCantidad);
    if (cantidadAbsoluta !== 0) {
        try {
            if (esAumento) {
                await sumarStockProducto(ingresoAnterior.id_producto, cantidadAbsoluta);
            } else {
                await restarStockProducto(ingresoAnterior.id_producto, cantidadAbsoluta);
            }
        } catch (error) {
            console.error('Error al actualizar el stock del producto:', error);
            throw error;
        }
    }

    conexion.query(`UPDATE ${tabla} SET ? WHERE ${idColumn} = ?`, [newData, id], async (error, result) => {
        if (error) {
            console.error('Error al actualizar:', error);
            throw error;
        }

        if (result.affectedRows > 0) {
            console.log('Actualización de ingreso y stock del producto exitosas');
        } else {
            console.error(`No se encontró ninguna fila para actualizar con ${idColumn}=${id}`);
            throw new Error(`No se encontró ninguna fila para actualizar con ${idColumn}=${id}`);
        }
    });
}

async function restarStockProducto(id_producto, cantidad) {
    return new Promise((resolve, reject) => {
        conexion.query(
            `UPDATE producto SET stock = stock - ? WHERE id_producto = ?`,
            [cantidad, id_producto],
            (error, result) => {
                if (error) {
                    console.error('Error al restar el stock del producto:', error);
                    reject(error);
                } else {
                    console.log('Resta de stock del producto anterior exitosa');
                    resolve(result);
                }
            }
        );
    });
}

async function sumarStockProducto(id_producto, cantidad) {
    return new Promise((resolve, reject) => {
        conexion.query(
            `UPDATE producto SET stock = stock + ? WHERE id_producto = ?`,
            [cantidad, id_producto],
            (error, result) => {
                if (error) {
                    console.error('Error al actualizar el stock del nuevo producto:', error);
                    reject(error);
                } else {
                    console.log('Suma de stock del nuevo producto exitosa');
                    resolve(result);
                }
            }
        );
    });
}

function eliminar(tabla, id) {
    const idColumn = `id_${tabla.replace(/^.*\./, '')}`;
    return new Promise((resolve, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE ${idColumn} = ?`, id, (error, result) => {
            if (error) {
                return reject(error);
            }

            if (result.affectedRows > 0) {
                resolve(result);
            } else {
                reject(new Error(`No se encontró ninguna fila para eliminar con ${idColumn}=${id}`));
            }
        });
    });
}


async function actualizarNumeroConsulta(idProducto) {
    try {
      const query = `UPDATE producto SET numero_consulta = numero_consulta + 1 WHERE id_producto = ?`;
      const [resultado] = await conexion.promise().execute(query, [idProducto]);
      return resultado;
    } catch (error) {
      throw error;
    }
}


const commonPart = `
    p.id_producto,
    MAX(p.codigo_OEM) AS codigo_OEM,
    MAX(p.codigo_interno) AS codigo_interno,
    MAX(p.codigo_fabricante) AS codigo_fabricante,
    MAX(p.origen) AS origen,
    MAX(p.marca_fabricante) AS marca_fabricante,
    MAX(p.descripcion) AS descripcion,
    MAX(p.multiplos) AS multiplos,
    MAX(p.precio) AS precio,
    MAX(p.stock) AS stock,
    MAX(p.oferta) AS oferta,
    MAX(p.numero_consulta) AS numero_consulta,
    MAX(p.medida) AS medida,
    MAX(p.id_categoria) AS id_categoria,
    COALESCE(MAX(ip.img_url), '') AS url_imagen_producto,
    COALESCE(MAX(ma.img_url), '') AS img_url_marca_auto
`;


function getDestacadosByConsulta() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                ${commonPart}
            FROM producto p
            LEFT JOIN img_producto ip ON p.id_producto = ip.id_producto
            LEFT JOIN aplicacion a ON p.id_producto = a.id_producto
            LEFT JOIN modelo_auto ma ON a.id_modelo_auto = ma.id_modelo_auto
            GROUP BY p.id_producto
            ORDER BY MAX(p.numero_consulta) DESC`;
        conexion.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function getOfertas() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                ${commonPart}
            FROM producto p
            LEFT JOIN img_producto ip ON p.id_producto = ip.id_producto
            LEFT JOIN aplicacion a ON p.id_producto = a.id_producto
            LEFT JOIN modelo_auto ma ON a.id_modelo_auto = ma.id_modelo_auto
            WHERE p.oferta = 'si'
            GROUP BY p.id_producto`;
        conexion.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}




async function getIngresoProductos() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
             ${commonPart}
            FROM
                producto p
            JOIN
                ingreso i ON p.id_producto = i.id_producto
            LEFT JOIN
                img_producto ip ON p.id_producto = ip.id_producto
            JOIN
                (SELECT id_producto, MAX(fecha_hora) AS ultima_fecha
                FROM ingreso
                GROUP BY id_producto) AS ultimos_ingresos
            ON
                i.id_producto = ultimos_ingresos.id_producto AND i.fecha_hora = ultimos_ingresos.ultima_fecha
            JOIN
                (SELECT id_producto, MAX(id_ingreso) AS ultimo_ingreso
                FROM ingreso
                GROUP BY id_producto) AS ultimo_ingreso
            ON
                i.id_producto = ultimo_ingreso.id_producto AND i.id_ingreso = ultimo_ingreso.ultimo_ingreso
            LEFT JOIN
                aplicacion a ON p.id_producto = a.id_producto
            LEFT JOIN
                modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
            LEFT JOIN
                marca_auto ma ON mo.id_marca_auto = ma.id_marca_auto
            GROUP BY
                p.id_producto
            ORDER BY
                i.fecha_hora DESC, i.id_ingreso DESC;`;

        conexion.query(query, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}


module.exports = {
    conexion,
    obtenerTodos,
    obtenerPorId,
    agregar,
    agregarConStock,
    actualizar,
    actualizarConStock,
    eliminar,
    actualizarNumeroConsulta,
    getDestacadosByConsulta,
    getOfertas,
    getIngresoProductos
}