const tabla = 'ingreso';

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

            // Verificar si la relación ya existe en tienda_producto
            const relacionExistente = await db.obtenerPorProductoYTienda(id_producto, id_tienda);

            if (relacionExistente && relacionExistente.length > 0) {
                // Si existe, actualizar el stock sumando la cantidad
                const stockActual = relacionExistente[0].stock;
                const nuevoStock = stockActual + cantidad;
                await db.actualizarStockTiendaProducto(relacionExistente[0].id_tienda_producto, nuevoStock);
            } else {
                // Si no existe, crear una nueva relación con el stock igual a la cantidad
                await db.crearRelacionTiendaProducto(id_producto, id_tienda, cantidad);
            }

            // Agregar el registro a la tabla de ingreso
            await db.agregar(tabla, nuevoRegistro);

            return 'Registro agregado exitosamente';
        } catch (error) {
            throw error;
        }
    }
    function update(id, newData) {
        return db.actualizar(tabla, id, newData);
    }
    function remove(id) {
        return db.eliminar(tabla, id);
    }

    return{
        getAll,
        getById,
        add,
        update,
        remove
    }
    
}