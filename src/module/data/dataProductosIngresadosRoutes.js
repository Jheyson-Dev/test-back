const express = require('express');
const router = express.Router();
const db = require('../../db/mysql');

router.get('/', async (req, res) => {
    try {
        const productos = await db.getIngresoProductos();
        res.status(200).json({ productos });
    } catch (error) {
        console.error('Error al obtener productos con imagen:', error);
        res.status(500).json({ error: 'Error al obtener productos con imagen' });
    }
});

module.exports = router;