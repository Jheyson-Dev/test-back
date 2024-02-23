const express = require('express');
const router = express.Router();
const db = require('../../db/mysql');

router.get('/:id', async (req, res) => {
    console.log(`Llegó a la ruta /api/application_data/${req.params.id}`);
    try {
        const data = await db.obtenerAplicacionesProducto(req.params.id);
        return res.status(200).json(data);
    } catch (error) {
        console.error(`Error en la ruta /api/application_data/${req.params.id}:`, error);
        return res.status(500).json({ error: true, message: 'Error interno' });
    }
});

module.exports = router;