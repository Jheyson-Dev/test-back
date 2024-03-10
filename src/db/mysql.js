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
                return reject(error);
            }

            if (result.affectedRows > 0) {
                resolve(result);
            } else {
                reject(new Error(`No se encontró ninguna fila para actualizar con ${idColumn}=${id}`));
            }
        });
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

const productosOferta = `
SELECT 
    o.id_oferta,
    MAX(o.descripcion) AS descripcion_oferta,
    o.descuento,
    o.priorizacion,
    c.nombre_producto,
    p.*,    
    (SELECT SUM(stock) FROM tienda_producto WHERE id_producto = p.id_producto) AS total_stock,
    GROUP_CONCAT(DISTINCT CONCAT(t.razon_social, '(', tp.stock, ')') ORDER BY t.razon_social ASC) AS stock_por_tienda,
    (SELECT JSON_ARRAYAGG(img_url) FROM img_producto WHERE id_producto = p.id_producto) AS imagenes
FROM 
    producto p
LEFT JOIN 
    categoria c ON p.id_categoria = c.id_categoria
JOIN 
    oferta o ON p.id_producto = o.id_producto
LEFT JOIN 
    tienda_producto tp ON p.id_producto = tp.id_producto
LEFT JOIN 
    tienda t ON tp.id_tienda = t.id_tienda
LEFT JOIN
    img_producto ip ON p.id_producto = ip.id_producto`

function obtenerProductosConPriorizacionSI() {
    return new Promise((resolve, reject) => {
        conexion.query(`
        ${productosOferta}
        WHERE 
            o.priorizacion = 'si'
        GROUP BY 
            p.id_producto, c.nombre_producto, o.descuento, o.id_oferta
        `, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

function obtenerProductosConOferta() {
    return new Promise((resolve, reject) => {
        conexion.query(`${productosOferta}
    GROUP BY 
        p.id_producto, c.nombre_producto, o.descuento, o.priorizacion, o.id_oferta
        `, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

async function actualizarNumeroConsulta(idProducto) {
    try {
      const query = `UPDATE producto SET consultas = consultas + 1 WHERE id_producto = ?`;
      const [resultado] = await conexion.promise().execute(query, [idProducto]);
      return resultado;
    } catch (error) {
      throw error;
    }
}

const oPDC = `p.id_producto,
    p.codigo_OEM,
    p.codigo_interno,
    p.codigo_fabricante,
    p.origen,
    p.marca_fabricante,
    p.descripcion,
    p.multiplos,
    p.consultas,
    p.medida,
    p.precio_compra,
    p.precio_venta,
    p.precio_minimo,
    c.id_categoria,
    c.nombre_producto,
    c.campo_medicion,
    c.url_campo_medicion,
    c.tipo`;

function obtenerProductosConDatosCompletos() {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT 
        ${oPDC},
        COALESCE((
            SELECT ma.nombre
            FROM aplicacion a
            LEFT JOIN modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
            LEFT JOIN marca_auto ma ON mo.id_marca_auto = ma.id_marca_auto
            WHERE a.id_producto = p.id_producto
            ORDER BY ma.nombre ASC
            LIMIT 1
        ), '') AS nombre_marca,
        COALESCE((
            SELECT mo.nombre
            FROM aplicacion a
            LEFT JOIN modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
            WHERE a.id_producto = p.id_producto
            ORDER BY mo.nombre ASC
            LIMIT 1
        ), '') AS nombre_modelo,
        COALESCE((
            SELECT mo.anio_inicio_termino
            FROM aplicacion a
            LEFT JOIN modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
            WHERE a.id_producto = p.id_producto
            ORDER BY mo.nombre ASC
            LIMIT 1
        ), '') AS anio_inicio_termino,
        COALESCE((SELECT SUM(tp.stock) FROM tienda_producto tp WHERE tp.id_producto = p.id_producto), '') AS total_stock,
        COALESCE((GROUP_CONCAT(DISTINCT CONCAT(t.razon_social, '(', tp.stock, ')') ORDER BY t.razon_social ASC)), '') AS stock_por_tienda,
        COALESCE((
            SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT('id_oferta', o.id_oferta, 'descripcion', o.descripcion, 'descuento', o.descuento, 'priorizacion', o.priorizacion)
                ) 
            FROM 
                oferta o 
            WHERE 
                o.id_producto = p.id_producto
        ), JSON_ARRAY()) AS ofertas,
        COALESCE((
            SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT('id_img_producto', ip.id_img_producto, 'img_url', ip.img_url)
                ) 
            FROM 
                img_producto ip 
            WHERE 
                ip.id_producto = p.id_producto
        ), JSON_ARRAY()) AS imagenes
    FROM 
        producto p
    LEFT JOIN 
        categoria c ON p.id_categoria = c.id_categoria
    LEFT JOIN 
        tienda_producto tp ON p.id_producto = tp.id_producto
    LEFT JOIN 
        tienda t ON tp.id_tienda = t.id_tienda
    GROUP BY 
        ${oPDC}`,
        (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

function obtenerProductosDestacados() {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT 
        ${oPDC},
        COALESCE((
            SELECT ma.nombre
            FROM aplicacion a
            LEFT JOIN modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
            LEFT JOIN marca_auto ma ON mo.id_marca_auto = ma.id_marca_auto
            WHERE a.id_producto = p.id_producto
            ORDER BY ma.nombre ASC
            LIMIT 1
        ), '') AS nombre_marca,
        COALESCE((
            SELECT mo.nombre
            FROM aplicacion a
            LEFT JOIN modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
            WHERE a.id_producto = p.id_producto
            ORDER BY mo.nombre ASC
            LIMIT 1
        ), '') AS nombre_modelo,
        COALESCE((
            SELECT mo.anio_inicio_termino
            FROM aplicacion a
            LEFT JOIN modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
            WHERE a.id_producto = p.id_producto
            ORDER BY mo.nombre ASC
            LIMIT 1
        ), '') AS anio_inicio_termino,
        COALESCE((SELECT SUM(tp.stock) FROM tienda_producto tp WHERE tp.id_producto = p.id_producto), '') AS total_stock,
        COALESCE((GROUP_CONCAT(DISTINCT CONCAT(t.razon_social, '(', tp.stock, ')') ORDER BY t.razon_social ASC)), '') AS stock_por_tienda,
        COALESCE((
            SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT('id_oferta', o.id_oferta, 'descripcion', o.descripcion, 'descuento', o.descuento, 'priorizacion', o.priorizacion)
                ) 
            FROM 
                oferta o 
            WHERE 
                o.id_producto = p.id_producto
        ), JSON_ARRAY()) AS ofertas,
        COALESCE((
            SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT('id_img_producto', ip.id_img_producto, 'img_url', ip.img_url)
                ) 
            FROM 
                img_producto ip 
            WHERE 
                ip.id_producto = p.id_producto
        ), JSON_ARRAY()) AS imagenes
    FROM 
        producto p
    LEFT JOIN 
        categoria c ON p.id_categoria = c.id_categoria
    LEFT JOIN 
        tienda_producto tp ON p.id_producto = tp.id_producto
    LEFT JOIN 
        tienda t ON tp.id_tienda = t.id_tienda
    GROUP BY 
        ${oPDC}
    ORDER BY 
        p.consultas DESC;`,
        (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

function obtenerProductosConDatosCompletosPorId(id) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT 
        p.id_producto,
        p.codigo_OEM,
        p.codigo_interno,
        p.codigo_fabricante,
        p.origen,
        p.marca_fabricante,
        p.descripcion,
        p.multiplos,
        p.consultas,
        p.medida,
        p.precio_compra,
        p.precio_venta,
        p.precio_minimo,
        c.id_categoria,
        c.nombre_producto,
        c.campo_medicion,
        c.url_campo_medicion,
        c.tipo,
        COALESCE((
            SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT('id_oferta', o.id_oferta, 'descripcion', o.descripcion, 'descuento', o.descuento, 'priorizacion', o.priorizacion)
                ) 
            FROM 
                oferta o 
            WHERE 
                o.id_producto = p.id_producto
        ), JSON_ARRAY()) AS ofertas,
        COALESCE((
            SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT('id_img_producto', ip.id_img_producto, 'img_url', ip.img_url)
                ) 
            FROM 
                img_producto ip 
            WHERE 
                ip.id_producto = p.id_producto
        ), JSON_ARRAY()) AS imagenes,
        COALESCE((
            SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT('id_tienda', t.id_tienda, 'ruc', t.ruc, 'razon_social', t.razon_social, 'direccion', t.direccion, 'encargado', t.encargado, 'celular', t.celular, 'stock', tp.stock)
                ) 
            FROM 
                tienda_producto tp 
                LEFT JOIN tienda t ON tp.id_tienda = t.id_tienda
            WHERE 
                tp.id_producto = p.id_producto
        ), JSON_ARRAY()) AS tiendas,
        COALESCE((
            SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT('id_reemplazo', r.id_reemplazo, 'id_producto', r.id_producto, 'producto_reemplazo', r.producto_reemplazo, 'variacion', r.variacion, 'notas', r.notas)
                ) 
            FROM 
                reemplazo r 
            WHERE 
                r.id_producto = p.id_producto
        ), JSON_ARRAY()) AS reemplazos,
        COALESCE((
            SELECT 
                JSON_ARRAYAGG(
                    JSON_OBJECT('id_modelo_auto', ma.id_marca_auto, 'nombre_marca', ma.nombre, 'id_modelo_auto', mo.id_modelo_auto, 'nombre_modelo', mo.nombre, 'anio_inicio_termino', mo.anio_inicio_termino, 'motor', mo.motor, 'img_url_modelo_auto', mo.img_url)
                ) 
            FROM 
                aplicacion a 
                LEFT JOIN modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
                LEFT JOIN marca_auto ma ON mo.id_marca_auto = ma.id_marca_auto
            WHERE 
                a.id_producto = p.id_producto
        ), JSON_ARRAY()) AS aplicaciones
    FROM 
        producto p
    LEFT JOIN 
        categoria c ON p.id_categoria = c.id_categoria
    WHERE
        p.id_producto = ?`,
        [id],
        (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}


const iP = `i.id_ingreso,
i.cantidad,
i.fecha_hora,
tp.id_producto,
p.codigo_OEM,
p.codigo_interno,
p.codigo_fabricante,
p.origen,
p.marca_fabricante,
p.descripcion,
p.multiplos,
p.consultas,
p.medida,
p.precio_compra,
p.precio_venta,
p.precio_minimo,
c.nombre_producto`;

function IngresosProductos(){
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT 
        ${iP},
        COALESCE(JSON_ARRAYAGG(COALESCE(ip.img_url, '')), JSON_ARRAY()) AS imagenes
    FROM 
        ingreso i
    INNER JOIN 
        tienda_producto tp ON i.id_tienda_producto = tp.id_tienda_producto
    INNER JOIN 
        producto p ON tp.id_producto = p.id_producto
    INNER JOIN 
        categoria c ON p.id_categoria = c.id_categoria
    LEFT JOIN 
        img_producto ip ON p.id_producto = ip.id_producto
    WHERE
        i.cantidad != 0
    GROUP BY 
        ${iP}
    ORDER BY SUBSTRING(i.fecha_hora, 1, 10) DESC, SUBSTRING(i.fecha_hora, 12, 8) DESC;`,
        (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}




function buscarProductosPorCodigo(busqueda) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                ${oPDC},
                COALESCE((
                    SELECT ma.nombre
                    FROM aplicacion a
                    LEFT JOIN modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
                    LEFT JOIN marca_auto ma ON mo.id_marca_auto = ma.id_marca_auto
                    WHERE a.id_producto = p.id_producto
                    ORDER BY ma.nombre ASC
                    LIMIT 1
                ), '') AS nombre_marca,
                COALESCE((
                    SELECT mo.nombre
                    FROM aplicacion a
                    LEFT JOIN modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
                    WHERE a.id_producto = p.id_producto
                    ORDER BY mo.nombre ASC
                    LIMIT 1
                ), '') AS nombre_modelo,
                COALESCE((
                    SELECT mo.anio_inicio_termino
                    FROM aplicacion a
                    LEFT JOIN modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
                    WHERE a.id_producto = p.id_producto
                    ORDER BY mo.nombre ASC
                    LIMIT 1
                ), '') AS anio_inicio_termino,
                COALESCE((SELECT SUM(tp.stock) FROM tienda_producto tp WHERE tp.id_producto = p.id_producto), '') AS total_stock,
                COALESCE((GROUP_CONCAT(DISTINCT CONCAT(t.razon_social, '(', tp.stock, ')') ORDER BY t.razon_social ASC)), '') AS stock_por_tienda,
                COALESCE((
                    SELECT 
                        JSON_ARRAYAGG(
                            JSON_OBJECT('id_oferta', o.id_oferta, 'descripcion', o.descripcion, 'descuento', o.descuento, 'priorizacion', o.priorizacion)
                        ) 
                    FROM 
                        oferta o 
                    WHERE 
                        o.id_producto = p.id_producto
                ), JSON_ARRAY()) AS ofertas,
                COALESCE((
                    SELECT 
                        JSON_ARRAYAGG(
                            JSON_OBJECT('id_img_producto', ip.id_img_producto, 'img_url', ip.img_url)
                        ) 
                    FROM 
                        img_producto ip 
                    WHERE 
                        ip.id_producto = p.id_producto
                ), JSON_ARRAY()) AS imagenes
            FROM 
                producto p
            LEFT JOIN 
                categoria c ON p.id_categoria = c.id_categoria
            LEFT JOIN 
                tienda_producto tp ON p.id_producto = tp.id_producto
            LEFT JOIN 
                tienda t ON tp.id_tienda = t.id_tienda
            WHERE
                p.codigo_OEM LIKE ? OR
                p.codigo_interno LIKE ? OR
                p.codigo_fabricante LIKE ?
            GROUP BY 
                ${oPDC}`;

        conexion.query(query, [`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}


async function obtenerModelosPorIdMarca(idMarcaAuto) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                ma.id_marca_auto,
                ma.nombre AS nombre_marca,
                ma.img_url AS img_url_marca,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id_modelo_auto', 
                            COALESCE(mo.id_modelo_auto, ''),
                            'nombre_modelo', 
                            COALESCE(mo.nombre, ''),
                            'anio_inicio_termino', 
                            COALESCE(mo.anio_inicio_termino, ''),
                            'motor', 
                            COALESCE(mo.motor, ''),
                            'img_url_modelo', 
                            COALESCE(mo.img_url, '')
                        )
                    ), 
                    JSON_ARRAY()
                ) AS modelos_auto
            FROM 
                marca_auto ma
            LEFT JOIN 
                modelo_auto mo ON ma.id_marca_auto = mo.id_marca_auto
            WHERE 
                ma.id_marca_auto = ?
            GROUP BY 
                ma.id_marca_auto, ma.nombre, ma.img_url`;

        conexion.query(query, [idMarcaAuto], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

async function obtenerDatosProductoPorIdModelo(idModeloAuto) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                ma.nombre AS nombre_marca,
                mo.id_modelo_auto,
                mo.nombre AS nombre_modelo,
                mo.anio_inicio_termino,
                mo.motor,
                mo.img_url,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id_producto', p.id_producto,
                            'codigo_OEM', p.codigo_OEM,
                            'codigo_interno', p.codigo_interno,
                            'codigo_fabricante', p.codigo_fabricante,
                            'origen', p.origen,
                            'marca_fabricante', p.marca_fabricante,
                            'descripcion', p.descripcion,
                            'multiplos', p.multiplos,
                            'consultas', p.consultas,
                            'medida', p.medida,
                            'precio_compra', p.precio_compra,
                            'precio_venta', p.precio_venta,
                            'precio_minimo', p.precio_minimo,
                            'id_categoria', c.id_categoria,
                            'nombre_producto', c.nombre_producto,
                            'total_stock', COALESCE((SELECT SUM(tp.stock) FROM tienda_producto tp WHERE tp.id_producto = p.id_producto), ''),
                            'stock_por_tienda', COALESCE((SELECT GROUP_CONCAT(DISTINCT CONCAT(t.razon_social, '(', tp.stock, ')') ORDER BY t.razon_social ASC) FROM tienda_producto tp INNER JOIN tienda t ON tp.id_tienda = t.id_tienda WHERE tp.id_producto = p.id_producto GROUP BY tp.id_producto), ''),
                            'imagenes', (
                                SELECT JSON_ARRAYAGG(COALESCE(img_url, '')) 
                                FROM img_producto 
                                WHERE id_producto = p.id_producto
                            )
                        )
                    ), 
                    JSON_ARRAY()
                ) AS productos
            FROM 
                modelo_auto mo
            LEFT JOIN 
                marca_auto ma ON mo.id_marca_auto = ma.id_marca_auto
            LEFT JOIN 
                aplicacion a ON mo.id_modelo_auto = a.id_modelo_auto
            LEFT JOIN 
                producto p ON a.id_producto = p.id_producto
            LEFT JOIN 
                categoria c ON p.id_categoria = c.id_categoria
            WHERE 
                mo.id_modelo_auto = ?
            GROUP BY 
                mo.id_modelo_auto;
        `;

        conexion.query(query, [idModeloAuto], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}


async function obtenerDatosProductoPorIdCategoria(idCategoria) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                c.id_categoria,
                c.nombre_producto AS nombre_categoria,
                c.campo_medicion,
                c.url_campo_medicion,
                c.tipo,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id_producto', p.id_producto,
                            'codigo_OEM', p.codigo_OEM,
                            'codigo_interno', p.codigo_interno,
                            'codigo_fabricante', p.codigo_fabricante,
                            'origen', p.origen,
                            'marca_fabricante', p.marca_fabricante,
                            'descripcion', p.descripcion,
                            'multiplos', p.multiplos,
                            'consultas', p.consultas,
                            'medida', p.medida,
                            'precio_compra', p.precio_compra,
                            'precio_venta', p.precio_venta,
                            'precio_minimo', p.precio_minimo,
                            'id_marca_auto', ma.id_marca_auto,
                            'marca_auto', ma.nombre,
                            'id_modelo_auto', mo.id_modelo_auto,
                            'modelo_auto', mo.nombre,
                            'anio_inicio_termino', mo.anio_inicio_termino,
                            'total_stock', COALESCE((SELECT SUM(tp.stock) FROM tienda_producto tp WHERE tp.id_producto = p.id_producto), ''),
                            'stock_por_tienda', COALESCE((SELECT GROUP_CONCAT(DISTINCT CONCAT(t.razon_social, '(', tp.stock, ')') ORDER BY t.razon_social ASC) FROM tienda_producto tp INNER JOIN tienda t ON tp.id_tienda = t.id_tienda WHERE tp.id_producto = p.id_producto GROUP BY tp.id_producto), ''),
                            'imagenes', (
                                SELECT JSON_ARRAYAGG(COALESCE(img_url, '')) 
                                FROM img_producto 
                                WHERE id_producto = p.id_producto
                            )
                        )
                    ), 
                    JSON_ARRAY()
                ) AS productos
            FROM 
                categoria c
            LEFT JOIN 
                producto p ON c.id_categoria = p.id_categoria
            LEFT JOIN 
                aplicacion a ON p.id_producto = a.id_producto
            LEFT JOIN 
                modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
            LEFT JOIN 
                marca_auto ma ON mo.id_marca_auto = ma.id_marca_auto
            WHERE 
                c.id_categoria = ?
            GROUP BY 
                c.id_categoria, c.nombre_producto;
        `;

        conexion.query(query, [idCategoria], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}



async function obtenerDatosProductoPorIdTienda(idTienda) {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT 
    t.id_tienda,
    t.ruc,
    t.razon_social AS nombre_tienda,
    t.direccion,
    t.encargado,
    t.celular,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id_producto', p.id_producto,
            'codigo_OEM', p.codigo_OEM,
            'codigo_interno', p.codigo_interno,
            'codigo_fabricante', p.codigo_fabricante,
            'origen', p.origen,
            'marca_fabricante', p.marca_fabricante,
            'descripcion', p.descripcion,
            'multiplos', p.multiplos,
            'consultas', p.consultas,
            'medida', p.medida,
            'precio_compra', p.precio_compra,
            'precio_venta', p.precio_venta,
            'precio_minimo', p.precio_minimo,
            'id_categoria', c.id_categoria,
            'nombre_categoria', c.nombre_producto,
            'stock', tp.stock,
            'imagenes', (
                SELECT JSON_ARRAYAGG(COALESCE(img_url, '')) 
                FROM img_producto 
                WHERE id_producto = p.id_producto
            ),
            'nombre_marca', (
                SELECT 
                    nombre
                FROM 
                    (
                        SELECT 
                            ma.nombre,
                            ROW_NUMBER() OVER (ORDER BY ma.nombre) AS rn
                        FROM 
                            aplicacion a
                        LEFT JOIN 
                            modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
                        LEFT JOIN 
                            marca_auto ma ON mo.id_marca_auto = ma.id_marca_auto
                        WHERE 
                            a.id_producto = p.id_producto
                        GROUP BY 
                            ma.nombre
                    ) AS sub
                WHERE 
                    rn = 1
            ),
            'nombre_modelo', (
                SELECT 
                    nombre
                FROM 
                    (
                        SELECT 
                            mo.nombre,
                            ROW_NUMBER() OVER (ORDER BY mo.nombre) AS rn
                        FROM 
                            aplicacion a
                        LEFT JOIN 
                            modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
                        WHERE 
                            a.id_producto = p.id_producto
                        GROUP BY 
                            mo.nombre
                    ) AS sub
                WHERE 
                    rn = 1
            ),
            'anio_inicio_termino', (
                SELECT 
                    mo.anio_inicio_termino
                FROM 
                    aplicacion a
                LEFT JOIN 
                    modelo_auto mo ON a.id_modelo_auto = mo.id_modelo_auto
                WHERE 
                    a.id_producto = p.id_producto
                LIMIT 1
            )
        )
    ) AS productos
FROM 
    tienda t
LEFT JOIN 
    (
        SELECT 
            id_tienda,
            id_producto,
            SUM(stock) AS stock
        FROM 
            tienda_producto
        GROUP BY 
            id_tienda,
            id_producto
    ) tp ON t.id_tienda = tp.id_tienda
LEFT JOIN 
    producto p ON tp.id_producto = p.id_producto
LEFT JOIN 
    categoria c ON p.id_categoria = c.id_categoria
WHERE 
    t.id_tienda = ?
GROUP BY 
    t.id_tienda;
        `;

        conexion.query(query, [idTienda], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}



function obtenerPorProductoYTienda(id_producto, id_tienda) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM tienda_producto WHERE id_producto = ? AND id_tienda = ?`, [id_producto, id_tienda], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

function actualizarStockTiendaProducto(id_tienda_producto, nuevoStock) {
    return new Promise((resolve, reject) => {
        conexion.query(`UPDATE tienda_producto SET stock = ? WHERE id_tienda_producto = ?`, [nuevoStock, id_tienda_producto], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}

function crearRelacionTiendaProducto(id_producto, id_tienda, stock) {
    return new Promise((resolve, reject) => {
        conexion.query(`INSERT INTO tienda_producto (id_producto, id_tienda, stock) VALUES (?, ?, ?)`, [id_producto, id_tienda, stock], (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
}



const TABLE_PRODUCTO = 'producto';

function agregarProducto(producto) {
    return new Promise((resolve, reject) => {
        // Contar la cantidad de registros existentes en la tabla producto
        conexion.query(`SELECT COUNT(*) AS total FROM ${TABLE_PRODUCTO}`, (error, results) => {
            if (error) {
                return reject(error);
            }

            let ultimoNumero = results[0].total + 1; // Obtener el siguiente número en base a la cantidad de registros
            const codigoInterno = generarCodigoInterno(ultimoNumero);
            const newData = {
                ...producto,
                codigo_interno: codigoInterno
            };

            // Insertar el nuevo producto con el código interno generado
            conexion.query(`INSERT INTO ${TABLE_PRODUCTO} SET ?`, newData, (error, result) => {
                if (error) {
                    console.error('Error al insertar:', error);
                    return reject(error);
                }
                console.log('Inserción exitosa:', result);
                resolve(result);
            });
        });
    });
}

function generarCodigoInterno(ultimoNumero) {
    const year = new Date().getFullYear(); // Año actual
    return `DE-PA-${year}-P${pad(ultimoNumero, 4)}`;
}

function pad(number, length) {
    return ('0000' + number).slice(-length);
}

function actualizarProducto(id, newData) {
    return new Promise((resolve, reject) => {
        // Eliminar el campo codigo_interno del objeto newData
        delete newData.codigo_interno;

        conexion.query(`UPDATE ${TABLE_PRODUCTO} SET ? WHERE id_producto = ?`, [newData, id], (error, result) => {
            if (error) {
                console.error('Error al actualizar:', error);
                return reject(error);
            }

            if (result.affectedRows > 0) {
                resolve(result);
            } else {
                reject(new Error(`No se encontró ninguna fila para actualizar con id_producto=${id}`));
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
    eliminar,

    obtenerProductosConPriorizacionSI,
    obtenerProductosConOferta,
    actualizarNumeroConsulta,
    obtenerProductosConDatosCompletos,
    obtenerProductosConDatosCompletosPorId,
    IngresosProductos,
    obtenerProductosDestacados, 
    buscarProductosPorCodigo,
    obtenerModelosPorIdMarca,
    obtenerDatosProductoPorIdModelo,
    obtenerDatosProductoPorIdCategoria,
    obtenerDatosProductoPorIdTienda,

    agregarProducto,
    actualizarProducto,

    obtenerPorProductoYTienda,
    actualizarStockTiendaProducto,
    crearRelacionTiendaProducto
}