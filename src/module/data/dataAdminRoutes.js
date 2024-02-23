const express = require('express');
const router = express.Router();
const db = require('../../db/mysql');

router.get('/', async (req, res) => {
    console.log('Llegó a la ruta /api/admin_data');
    try {
        const data = await db.obtenerDatosParaAdmin();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error en la ruta /api/admin_data:', error);
        return res.status(500).json({ error: true, message: 'Error interno' });
    }
});

router.get('/buscar', async (req, res) => {
    console.log('Llegó a la ruta /api/admin_data/buscar');
    const query = req.query.q; // Obtiene el parámetro de consulta 'q' de la URL

    try {
        if (query) {
            // Realiza la búsqueda si hay un término de búsqueda proporcionado
            const searchData = await db.buscarDatosParaAdmin(query);
            return res.status(200).json(searchData);
        } else {
            // Devuelve un mensaje si no hay término de búsqueda proporcionado
            return res.status(400).json({ error: true, message: 'Término de búsqueda no proporcionado' });
        }
    } catch (error) {
        console.error('Error en la ruta /api/admin_data/buscar:', error);
        return res.status(500).json({ error: true, message: 'Error interno' });
    }
});

module.exports = router;