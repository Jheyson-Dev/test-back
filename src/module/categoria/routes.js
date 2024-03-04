const express = require('express');
const retorno = require('../../red/return');
const controller = require('./index');


const router = express.Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', add);
router.put('/:id', update); 
router.delete('/:id', remove);



async function getAll(req, res){
    try{
        const items = await controller.getAll();
        retorno.success(req, res, items, 200);
    }catch(err){
        retorno.error(req, res, err, 500);
    }
};

async function getById(req, res) {
    const idCategoria = req.params.id;
    try {
        const productosConImagenes = await controller.getById(idCategoria);
        const response = {
            id_categoria: productosConImagenes[0].id_categoria,
            nombre_producto: productosConImagenes[0].nombre_producto,
            campo_medicion: productosConImagenes[0].campo_medicion,
            url_campo_medicion: productosConImagenes[0].url_campo_medicion,
            productos: productosConImagenes.map(producto => ({
                ...producto,
                imagenes: producto.imagenes.split(',')
            }))
        };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error al obtener productos con imágenes y categoría por ID de categoría:', error);
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