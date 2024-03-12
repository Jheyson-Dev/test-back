const tabla = 'reduccion_inventario';

module.exports = function (dbInjected) {

    let db = dbInjected;

    if(!db){
        db = require('../../db/mysql')
    }

    function getAll() {
        return db.obtenerTodos(tabla);
    }
    function getById(id) {
        return db.obtenerPorId(tabla, id);
    }
    async function add(body) {
        try {
            const nuevoRegistro = body;
            const id_producto = nuevoRegistro.id_producto;
            const id_tienda = nuevoRegistro.id_tienda;
            const cantidad = nuevoRegistro.cantidad;
            const usuario = nuevoRegistro.usuario;
    
            const relacionExistente = await db.obtenerPorProductoYTienda(id_producto, id_tienda);
    
            if (!relacionExistente || relacionExistente.length === 0) {
                throw new Error("La tienda no tiene stock de dicho producto.");
            }
    
            const stockActual = relacionExistente[0].stock;
    
            if (parseInt(cantidad) > parseInt(stockActual)) {
                throw new Error("No hay stock suficiente en la tienda para realizar la reducción de inventario.");
            }
    
            const nuevoStock = parseInt(stockActual) - parseInt(cantidad);
    
            await db.actualizarStockTiendaProducto(relacionExistente[0].id_tienda_producto, nuevoStock);
            await db.agregarReduccionInventario(id_producto, id_tienda, cantidad, usuario);
    
            return "Reducción de inventario realizada correctamente.";
        } catch (error) {
            throw error;
        }
    }
    return{
        getAll,
        getById,
        add
    }
    
}