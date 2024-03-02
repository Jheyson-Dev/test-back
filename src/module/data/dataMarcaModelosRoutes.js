const express = require('express');
const router = express.Router();
const db = require('../../db/mysql');

router.get('/', async (req, res) => {
    try {
        const modelosPorMarca = await db.obtenerModelosPorMarca();
        const dataEstructurada = {};
        modelosPorMarca.forEach(modelo => {
            const { id_marca_auto, id_modelo_auto, nombre_marca, img_url_marca, cantidad_modelos, nombre_modelo, anio_inicio, anio_termino, img_url_modelo, cantidad_productos } = modelo;
            
            if (!dataEstructurada[nombre_marca]) {
                dataEstructurada[nombre_marca] = {
                    id_marca_auto,
                    cantidad_modelos,
                    img_url_marca,
                    modelos: {}
                };
            } else {
                dataEstructurada[nombre_marca].cantidad_modelos++;
            }
            
            dataEstructurada[nombre_marca].modelos[id_modelo_auto] = {
                id_modelo_auto,
                nombre_modelo,
                anio_inicio: anio_inicio || '',
                anio_termino: anio_termino || '',
                img_url_modelo: img_url_modelo || '',
                cantidad_productos
            };
        });
        
        res.status(200).json(dataEstructurada);
    } catch (error) {
        console.error('Error al obtener modelos por marca:', error);
        res.status(500).json({ error: true, message: 'Error interno' });
    }
});

module.exports = router;