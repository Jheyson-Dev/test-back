const express = require('express');
const router = express.Router();
const db = require('../../db/mysql'); // Asegúrate de que la ruta sea correcta

router.get('/', async (req, res) => {
    try {
        const productosDestacados = await db.getDestacadosByConsulta(); // Llama a la función desde el objeto controller

        res.status(200).json({ productos: productosDestacados });
    } catch (error) {
        console.error('Error al obtener productos destacados:', error);
        res.status(500).json({ error: 'Error al obtener productos destacados' });
    }
});

module.exports = router;