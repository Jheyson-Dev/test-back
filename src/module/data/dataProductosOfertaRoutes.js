const express = require('express');
const router = express.Router();
const db = require('../../db/mysql'); 

router.get('/', async (req, res) => {
    try {
        const productosOferta = await db.getOfertas();
        res.status(200).json({ productos: productosOferta });
    } catch (error) {
        console.error('Error al obtener productos en oferta:', error);
        res.status(500).json({ error: 'Error al obtener productos en oferta' });
    }
});

module.exports = router;