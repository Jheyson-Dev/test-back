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
    const idModeloAuto = req.params.id;
    try {
        const modeloAutoYProductosConImagenes = await controller.getById(idModeloAuto);
        const modeloAuto = modeloAutoYProductosConImagenes[0];
        const productos = modeloAutoYProductosConImagenes.map(producto => ({
            id_producto: producto.id_producto,
            nombre_producto: producto.nombre_producto_categoria,
            codigo_OEM: producto.codigo_OEM,
            codigo_interno: producto.codigo_interno,
            codigo_fabricante: producto.codigo_fabricante,
            origen: producto.origen,
            marca_fabricante: producto.marca_fabricante,
            descripcion: producto.descripcion,
            multiplos: producto.multiplos,
            precio: producto.precio,
            stock: producto.stock,
            oferta: producto.oferta,
            numero_consulta: producto.numero_consulta,
            medida: producto.medida,
            id_categoria: producto.id_categoria,
            imagenes: producto.imagenes ? producto.imagenes.split(',') : [],
        }));

        const response = {
            modelo_auto: {
                id_modelo_auto: modeloAuto.id_modelo_auto,
                nombre: modeloAuto.nombre,
                anio_inicio: modeloAuto.anio_inicio,
                anio_termino: modeloAuto.anio_termino,
                img_url: modeloAuto.img_url,
                id_marca_auto: modeloAuto.id_marca_auto,
                nombre_marca_auto: modeloAuto.nombre_marca_auto,
                productos: productos
            }
        };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error al obtener modelo auto y productos con imágenes por ID de modelo:', error);
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