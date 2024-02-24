const express = require('express');
const router = express.Router();
const db = require('../../db/mysql');


router.get('/:idModeloAuto/:idCategoria?', async (req, res) => {
    const { idModeloAuto, idCategoria } = req.params;

    try {
        const productos = await db.obtenerProductosPorModeloYCategoria(idModeloAuto, idCategoria);
        return res.status(200).json({ productos });
    } catch (error) {
        console.error('Error al obtener productos por modelo y categoría:', error);
        return res.status(500).json({ error: true, message: 'Error interno' });
    }
});


module.exports = router;  