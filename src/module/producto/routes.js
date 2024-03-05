const express = require('express');
const retorno = require('../../red/return');
const controller = require('./index');
const actualizarNumeroConsultaMiddleware = require('../../middleware/actualizarNumeroConsultaMiddleware');

const router = express.Router();

router.get('/', getAll);
router.get('/:id', actualizarNumeroConsultaMiddleware, getById); 
router.post('/', add);
router.put('/:id', update); 
router.delete('/:id', remove);



async function getAll(req, res){
    try {
        const productos = await controller.getAll();
        productos.forEach(producto => {
            if (producto.imagenes) {
                producto.imagenes = producto.imagenes.split(',');
            } else {
                producto.imagenes = [];
            }
        });
        retorno.success(req, res, productos, 200);
    } catch (err) {
        retorno.error(req, res, err, 500);
    }
}

async function getById(req, res) {
    const idProducto = req.params.id;
    try {
        const producto = await controller.getById(idProducto);
        const imagenes = producto[0].imagenes ? producto[0].imagenes.split(',') : [];
        
        producto[0].imagenes = imagenes;

        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al obtener el producto por ID:', error);
        res.status(500).json({ error: true, message: 'Error interno' });
    } 
}

async function add(req, res, next) {
    try {
        const nuevoRegistro = req.body;
        const resultado = await controller.add(nuevoRegistro);
        retorno.success(req, res, 'Registro agregado exitosamente', 201);
    } catch (err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const id = req.params.id;
        const datosActualizados = req.body;
        const resultado = await controller.update(id, datosActualizados);
        retorno.success(req, res, 'Registro actualizado exitosamente', 200);
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        const id = req.params.id;
        const items = await controller.remove(id);
        retorno.success(req, res, 'Eliminado exitosamente', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;