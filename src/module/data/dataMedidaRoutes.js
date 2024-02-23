const express = require('express');
const router = express.Router();
const db = require('../../db/mysql');

// Rutas relacionadas con datos de medidas
router.get('/:categoria', async (req, res) => {
    const { categoria } = req.params;
    const medida = req.query.medida;
    const busqueda = req.query.busqueda;

    console.log(`Llegó a la ruta /api/medida/${categoria}?medida=${medida}&busqueda=${busqueda}`);

    try {
        const medidaPopular = await db.obtenerMedidaPopularPorCategoria(categoria);
        const data = await db.obtenerDatosPorCategoriaConMedidaYBusqueda(categoria, medida, busqueda);

        return res.status(200).json({
            categoria,
            medidaPopular,
            datos: data,
        });
    } catch (error) {
        console.error(`Error en la ruta /api/medida/${categoria}:`, error);
        return res.status(500).json({ error: true, message: 'Error interno' });
    }
});

module.exports = router;