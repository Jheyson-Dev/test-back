const express = require('express');
const router = express.Router();
const db = require('../../db/mysql');

router.get('/:idProducto', async (req, res) => {
    const idProducto = req.params.idProducto;
    try {
        const producto = await db.obtenerProductoPorId(idProducto);
        const categoriaProducto = await db.obtenerCategoriaProducto(producto.id_categoria);
        const reemplazos = await db.obtenerReemplazosProducto(idProducto);
        const imagenesProducto = await db.obtenerImagenesProducto(idProducto);
        const aplicacionesProducto = await db.obtenerAplicacionesProducto(idProducto);

        const productoCompleto = {
            ...producto,
            nombre: categoriaProducto.nombre_producto || '',
            reemplazos: reemplazos.map(reemplazo => ({
                ...reemplazo,
                id_producto: reemplazo.id_producto_reemplazo
            })),
            imagenes: imagenesProducto.map(imagen => ({
                ...imagen
            })),
            aplicaciones: aplicacionesProducto.map(aplicacion => ({
                ...aplicacion
            }))
        };
        
        res.status(200).json(productoCompleto);
    } catch (error) {
        console.error('Error al obtener datos del producto:', error);
        res.status(500).json({ error: true, message: 'Error interno' });
    }
});
module.exports = router;