const express = require('express');
const router = express.Router();
const db = require('../../db/mysql');

router.get('/', async (req, res) => {
    try {
        const modelosPorMarca = await db.obtenerModelosPorMarca();
        
        // Estructurar los datos según lo requerido
        const dataEstructurada = {};
        modelosPorMarca.forEach(modelo => {
            const nombreMarca = modelo.nombre_marca;
            const { nombre_modelo, cantidad_productos } = modelo;
            
            if (!dataEstructurada[nombreMarca]) {
                dataEstructurada[nombreMarca] = [];
            }
            
            dataEstructurada[nombreMarca].push({
                nombre_modelo,
                cantidad_productos
            });
        });
        
        res.status(200).json(dataEstructurada);
    } catch (error) {
        console.error('Error al obtener modelos por marca:', error);
        res.status(500).json({ error: true, message: 'Error interno' });
    }
});

module.exports = router;