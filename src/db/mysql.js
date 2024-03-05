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

async function buscarProductosPorCodigo(busqueda) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                COALESCE(ma.nombre, '') AS nombre_marca_auto,
                COALESCE(mo.nombre, '') AS nombre_modelo_auto,
                COALESCE(mo.anio_inicio, '') AS anio_inicio,
                COALESCE(mo.anio_termino, '') AS anio_termino,
                COALESCE(cat.nombre_producto, '') AS nombre_producto,
                p.*,
                COALESCE(ip.img_url, '') AS url_imagen_producto
            FROM
                producto p
                LEFT JOIN categoria cat ON p.id_categoria = cat.id_categoria
                LEFT JOIN aplicacion a ON p.id_producto = a.id_producto
                LEFT JOIN modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
                LEFT JOIN marca_auto ma ON mo.id_marca_auto = ma.id_marca_auto
                LEFT JOIN img_producto ip ON p.id_producto = ip.id_producto
            WHERE
                p.codigo_OEM LIKE ?
                OR p.codigo_interno LIKE ?
                OR p.codigo_fabricante LIKE ?
            ORDER BY
                NULLIF(ma.nombre, '') IS NULL ASC, ma.nombre ASC,
                NULLIF(mo.nombre, '') IS NULL ASC, mo.nombre ASC;`;

        conexion.query(query, [`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`], (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}


async function obtenerModelosPorIdMarca(idMarcaAuto) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                ma.id_marca_auto,
                mo.id_modelo_auto,
                mo.nombre AS nombre_modelo,
                mo.anio_inicio,
                mo.anio_termino,
                mo.img_url AS img_url_modelo,
                p.*,
                c.nombre_producto AS nombre_categoria
            FROM
                modelo_auto mo
                INNER JOIN aplicacion a ON mo.id_modelo_auto = a.id_modelo_auto
                INNER JOIN producto p ON a.id_producto = p.id_producto
                INNER JOIN categoria c ON p.id_categoria = c.id_categoria
                INNER JOIN marca_auto ma ON mo.id_marca_auto = ma.id_marca_auto
            WHERE
                ma.id_marca_auto = ?
            ORDER BY
                ma.nombre, mo.nombre;`;

        conexion.query(query, [idMarcaAuto], (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}






async function obtenerProductoPorId(idProducto) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM producto WHERE id_producto = ?';
        conexion.query(query, [idProducto], (error, resultado) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultado[0]);
            }
        });
    });
}


async function obtenerCategoriaProducto(idCategoria) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM categoria WHERE id_categoria = ?';
        conexion.query(query, [idCategoria], (error, resultado) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultado[0]);
            }
        });
    });
}


async function obtenerReemplazosProducto(idProducto) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                r.*, 
                p.*, 
                c.nombre_producto AS nombre 
            FROM 
                reemplazo r
                JOIN producto p ON r.producto_reemplazo = p.id_producto
                JOIN categoria c ON p.id_categoria = c.id_categoria
            WHERE 
                r.id_producto = ?`;
        conexion.query(query, [idProducto], (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}


async function obtenerImagenesProducto(idProducto) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM img_producto WHERE id_producto = ?';
        conexion.query(query, [idProducto], (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}

async function obtenerAplicacionesProducto(idProducto) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                a.*, 
                ma.nombre AS nombre_marca_auto, 
                mo.nombre AS nombre_modelo_auto,
                mo.anio_inicio,
                mo.anio_termino
            FROM 
                aplicacion a
                JOIN modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
                JOIN marca_auto ma ON mo.id_marca_auto = ma.id_marca_auto
            WHERE 
                a.id_producto = ?`;
        conexion.query(query, [idProducto], (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}




const productoConNombre = `SELECT p.*, c.id_categoria, c.nombre_producto,
    GROUP_CONCAT(ip.img_url) AS imagenes
FROM producto p
INNER JOIN categoria c ON p.id_categoria = c.id_categoria
LEFT JOIN img_producto ip ON p.id_producto = ip.id_producto
GROUP BY p.id_producto`;

async function obtenerProductosConCategoria() {
    const query = `${productoConNombre}`;
    return new Promise((resolve, reject) => {
        conexion.query(query, (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}

async function obtenerProductoConCategoriaPorId(idProducto) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT p.*, c.id_categoria, c.nombre_producto, GROUP_CONCAT(ip.img_url) AS imagenes
            FROM producto p
            INNER JOIN categoria c ON p.id_categoria = c.id_categoria
            LEFT JOIN img_producto ip ON p.id_producto = ip.id_producto
            WHERE p.id_producto = ?
            GROUP BY p.id_producto`;

        conexion.query(query, [idProducto], (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}

const imagenesCodigoInterno=  `SELECT ip.*, p.id_producto, p.codigo_interno
FROM img_producto ip
INNER JOIN producto p ON ip.id_producto = p.id_producto`;

async function obtenerImagenesConCodigoInterno() {
    const query = imagenesCodigoInterno;    
    return new Promise((resolve, reject) => {
        conexion.query(query, (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}

async function obtenerImagenesConCInternoPorId(idImg) {
    return new Promise((resolve, reject) => {
        const query = `${imagenesCodigoInterno}
            WHERE ip.id_img_producto = ?`;

        conexion.query(query, [idImg], (error, resultados) => {
    if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}
const reemplazosCodigoInterno = `SELECT r.*, p.codigo_interno AS codigo_interno_original, p2.codigo_interno AS codigo_interno_reemplazo
FROM reemplazo r
INNER JOIN producto p ON r.id_producto = p.id_producto
INNER JOIN producto p2 ON r.producto_reemplazo = p2.id_producto`;

async function obtenerTodosReemplazos() {
    const query = reemplazosCodigoInterno;    
    return new Promise((resolve, reject) => {
        conexion.query(query, (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}
async function obtenerReemplazoPorId(idReemplazo) {
    const query = `${reemplazosCodigoInterno}
        WHERE r.id_reemplazo = ?`;
    
    return new Promise((resolve, reject) => {
        conexion.query(query, [idReemplazo], (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados[0]);
            }
        });
    });
}

const aplicacionCodigoModelo = `SELECT a.*, p.codigo_interno, m.nombre AS nombre_modelo_auto
FROM aplicacion a
INNER JOIN producto p ON a.id_producto = p.id_producto
INNER JOIN modelo_auto m ON a.id_modelo_auto = m.id_modelo_auto`

async function obtenerTodasAplicaciones() {
    const query = aplicacionCodigoModelo;
    
    return new Promise((resolve, reject) => {
        conexion.query(query, (error, resultados) => {

    if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}

async function obtenerAplicacionPorId(idAplicacion) {
    const query = `${aplicacionCodigoModelo}
        WHERE a.id_aplicacion = ?`;

    return new Promise((resolve, reject) => {
        conexion.query(query, [idAplicacion], (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados[0]);
            }
        });
    });
}

const modelo_marca = `SELECT ma.nombre AS nombre_marca, mo.*
FROM modelo_auto mo
INNER JOIN marca_auto ma ON mo.id_marca_auto = ma.id_marca_auto`;

async function obtenerModeloAutoConMarca() {
    const query = modelo_marca;
    return new Promise((resolve, reject) => {
        conexion.query(query, (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}

async function obtenerModeloAutoPorId(idModeloAuto) {
    return new Promise((resolve, reject) => {
        const query = `${modelo_marca}
            WHERE mo.id_modelo_auto = ?`;

        conexion.query(query, [idModeloAuto], (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados[0]);
            }
        });
    });
}

async function obtenerProductosConImagenesYCategoriaPorIDCategoria(idCategoria) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                c.*,
                p.*,
                GROUP_CONCAT(ip.img_url) AS imagenes
            FROM 
                categoria c
                INNER JOIN producto p ON c.id_categoria = p.id_categoria
                LEFT JOIN img_producto ip ON p.id_producto = ip.id_producto
            WHERE 
                c.id_categoria = ?
            GROUP BY 
                p.id_producto`;

        conexion.query(query, [idCategoria], (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}


async function obtenerModeloAutoYProductosConImagenesPorIDModelo(idModeloAuto) {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT 
            ma.*,
            marca.nombre AS nombre_marca_auto,
            p.*,
            c.nombre_producto AS nombre_producto_categoria,
            GROUP_CONCAT(ip.img_url) AS imagenes
        FROM 
            modelo_auto ma
            LEFT JOIN aplicacion a ON ma.id_modelo_auto = a.id_modelo_auto
            LEFT JOIN producto p ON a.id_producto = p.id_producto
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
            LEFT JOIN img_producto ip ON p.id_producto = ip.id_producto
            LEFT JOIN marca_auto marca ON ma.id_marca_auto = marca.id_marca_auto
        WHERE 
            ma.id_modelo_auto = ?
        GROUP BY 
            p.id_producto;`;

        conexion.query(query, [idModeloAuto], (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados);
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
    getIngresoProductos,
    buscarProductosPorCodigo,
    obtenerModelosPorIdMarca,
    obtenerProductoPorId,
    obtenerCategoriaProducto,
    obtenerReemplazosProducto,
    obtenerImagenesProducto,
    obtenerAplicacionesProducto,
    obtenerProductosConCategoria,
    obtenerProductoConCategoriaPorId,
    obtenerImagenesConCodigoInterno,
    obtenerImagenesConCInternoPorId,
    obtenerTodosReemplazos,
    obtenerReemplazoPorId,
    obtenerTodasAplicaciones,
    obtenerAplicacionPorId,
    obtenerModeloAutoConMarca,
    obtenerModeloAutoPorId,
    obtenerProductosConImagenesYCategoriaPorIDCategoria,
    obtenerModeloAutoYProductosConImagenesPorIDModelo
}