const express = require('express');
const router = express.Router();
const db = require('../../db/mysql');

router.get('/:idMarcaAuto', async (req, res) => {
    const idMarcaAuto = req.params.idMarcaAuto;
    try {
        const modelosConProductos = await db.obtenerModelosPorIdMarca(idMarcaAuto);
        const dataEstructurada = {};
        modelosConProductos.forEach(modelo => {
            const {
                id_modelo_auto,
                nombre_modelo,
                anio_inicio,
                anio_termino,
                img_url_modelo,
                productos
            } = modelo;
            if (!dataEstructurada[id_modelo_auto]) {
                dataEstructurada[id_modelo_auto] = {
                    id_modelo_auto,
                    nombre_modelo,
                    anio_inicio,
                    anio_termino,
                    img_url_modelo,
                    productos: []
                };
            }
            dataEstructurada[id_modelo_auto].productos.push({
                anio_inicio,
                anio_termino,
                id_producto: modelo.id_producto,
                nombre_categoria: modelo.nombre_categoria,
                descripcion: modelo.descripcion,
                origen: modelo.origen,
                marca: modelo.marca_fabricante,
                codigo_interno: modelo.codigo_interno,
                costo: modelo.costo,
                stock: modelo.stock,
                oferta: modelo.oferta,
                codigo_OEM: modelo.codigo_OEM
            });
        });
        res.status(200).json(Object.values(dataEstructurada));
    } catch (error) {
        console.error('Error al obtener modelos por marca:', error);
        res.status(500).json({ error: true, message: 'Error interno' });
    }
});

module.exports = router;
