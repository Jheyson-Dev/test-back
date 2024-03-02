const tabla = 'aplicacion';

module.exports = function (dbInjected) {

    let db = dbInjected;

    if(!db){
        db = require('../../db/mysql')
    }

    async function getAll() {
        try {
            const aplicaciones = await db.obtenerTodasAplicaciones();
            return aplicaciones;
        } catch (error) {
            
           
    throw new Error('Error al obtener todas las aplicaciones');
        }
    }
    async function getById(id) {
        try {
            const aplicacion = await db.obtenerAplicacionPorId(id);
            return aplicacion;
        } catch (error) {
            throw new Error('Error al obtener la aplicación por ID');
        }
    }
    function add(body) {
        return db.agregar(tabla, body);
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