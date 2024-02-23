const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const config = require('./config');

const authRoutes = require('./module/auth/routes');
const usuarios = require('./module/usuario/routes');
const personas = require('./module/persona/routes');
const cajas = require('./module/caja/routes');
const trabajadores = require('./module/trabajador/routes');
// const clientes = require('./module/cliente/routes');
// const ventas = require('./module/venta/routes');
const proveedores = require('./module/proveedor/routes');
const pedidos = require('./module/pedido/routes');
const marcaAuto = require('./module/marcaAuto/routes');
const modeloAuto = require('./module/modeloAuto/routes');
const auto = require('./module/auto/routes');
const medidas = require('./module/medida/routes');
const categorias = require('./module/categoria/routes');
const paisOrigen = require('./module/paisOrigen/routes');
const marcaFabricante = require('./module/marcaFabricante/routes');
const productos = require('./module/producto/routes');
const aplicaciones = require('./module/aplicacion/routes');
const imgProducto = require('./module/imgProducto/routes');
const oferta = require('./module/oferta/routes');
const reemplazos = require('./module/reemplazo/routes');
const empresas = require('./module/empresa/routes');
const tiendas = require('./module/tienda/routes');
const transferencias = require('./module/transferencia/routes');
const inventarios = require('./module/inventario/routes');
const ingresoProducto = require('./module/ingresoProducto/routes');
// const detalleVenta = require('./module/detalleVenta/routes');
const detallePedido = require('./module/detallePedido/routes');

const dataAdminRoutes = require('./module/data/dataAdminRoutes');
const dataWorkerRoutes = require('./module/data/dataWorkerRoutes');
const dataProductRoutes = require('./module/data/dataReplacementRoutes');
const dataApplicationRoutes = require('./module/data/dataApplicationRoutes');

const errors = require('./red/errors');

const app = express();

//middleware
app.use(cors());  
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//configuración
app.set('port', config.app.port);

//rutas
app.use('/api/auth', authRoutes); 
app.use('/api/usuarios', usuarios);
app.use('/api/personas', personas);
app.use('/api/cajas', cajas);
app.use('/api/trabajadores', trabajadores);
// app.use('/api/clientes', clientes);
// app.use('/api/ventas', ventas);
app.use('/api/proveedores', proveedores);
app.use('/api/pedidos', pedidos);
app.use('/api/marca-autos', marcaAuto);
app.use('/api/modelo-autos', modeloAuto);
app.use('/api/autos', auto);
app.use('/api/medidas', medidas);
app.use('/api/categorias', categorias);
app.use('/api/pais-origenes', paisOrigen);
app.use('/api/marca-fabricantes', marcaFabricante);
app.use('/api/productos', productos);
app.use('/api/aplicaciones', aplicaciones);
app.use('/api/img-productos', imgProducto);
app.use('/api/ofertas', oferta);
app.use('/api/reemplazos', reemplazos);
app.use('/api/empresas', empresas);
app.use('/api/tiendas', tiendas);
app.use('/api/transferencias', transferencias);
app.use('/api/inventarios', inventarios);
app.use('/api/ingreso-productos', ingresoProducto);
// app.use('/api/detalle-ventas', detalleVenta);
app.use('/api/detalle-pedidos', detallePedido);

app.use('/api/admin_data', dataAdminRoutes);
app.use('/api/worker_data', dataWorkerRoutes);
app.use('/api/product_reemplazo', dataProductRoutes);
app.use('/api/product_aplicacion', dataApplicationRoutes);

app.use(errors);

module.exports = app;