const express = require('express');
const router = express.Router();
const db = require('../../db/mysql');

// Rutas relacionadas con datos
router.get('/', async (req, res) => {
    console.log('Llegó a la ruta /api/datos_general');
    try {
        const data = await db.obtenerDatosRelacionados();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error en la ruta /api/datos_general:', error);
        return res.status(500).json({ error: true, message: 'Error interno' });
    }
});

module.exports = router;