const express = require('express');
const router = express.Router();
const db = require('../../db/mysql');

// Rutas relacionadas con datos del trabajador
router.get('/:id', async (req, res) => {
    console.log(`Llegó a la ruta /api/worker_data/${req.params.id}`);
    try {
        const data = await db.obtenerDatosParaWorker(req.params.id);
        return res.status(200).json(data);
    } catch (error) {
        console.error(`Error en la ruta /api/worker_data/${req.params.id}:`, error);
        return res.status(500).json({ error: true, message: 'Error interno' });
    }
});

// Ruta para búsqueda de datos del trabajador
router.get('/:id/buscar', async (req, res) => {
    console.log(`Llegó a la ruta /api/worker_data/${req.params.id}/buscar`);
    try {
        const query = req.query.q || '';  // Obtener el parámetro de búsqueda desde la URL
        const data = await db.buscarDatosParaWorker(req.params.id, query);
        return res.status(200).json(data);
    } catch (error) {
        console.error(`Error en la ruta /api/worker_data/${req.params.id}/buscar:`, error);
        return res.status(500).json({ error: true, message: 'Error interno' });
    }
});


module.exports = router;
