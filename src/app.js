const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const config = require('./config');
const upload = require('./middleware/multerConfig');

const authRoutes = require('./module/auth/routes');
const usuarios = require('./module/usuario/routes');
const marcaAuto = require('./module/marcaAuto/routes');
const modeloAuto = require('./module/modeloAuto/routes');
const categorias = require('./module/categoria/routes');
const productos = require('./module/producto/routes');
const aplicaciones = require('./module/aplicacion/routes');
const imgProducto = require('./module/imgProducto/routes');
const oferta = require('./module/oferta/routes');
const reemplazos = require('./module/reemplazo/routes');
const tienda = require('./module/tienda/routes');
const tiendaUsuario = require('./module/tiendaUsuario/routes');
const tiendaProducto = require('./module/tiendaProducto/routes');
const ingresos = require('./module/ingreso/routes');
const auto = require('./module/auto/routes');
const reduccionInventario = require('./module/reduccionInventario/routes');
const compra = require('./module/compra/routes');
const pedido = require('./module/pedido/routes');
const traspaso = require('./module/traspaso/routes');

const dataPriorizadas = require('./module/data/dataProductosOfertasPriorizadasRoutes');
const dataDestacados = require('./module/data/dataProductosDestacadosRoutes');
const dataIngresos = require('./module/data/dataProductosIngresadosRoutes');
const dataBusqueda = require('./module/data/busquedaCodProductosRoutes');

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
app.use('/api/marca_autos', marcaAuto);
app.use('/api/modelo_autos', modeloAuto);
app.use('/api/categorias', categorias);
app.use('/api/productos', productos);
app.use('/api/aplicaciones', aplicaciones);
app.use('/api/img_productos', imgProducto);
app.use('/api/ofertas', oferta);
app.use('/api/reemplazos', reemplazos);
app.use('/api/tiendas', tienda);
app.use('/api/tienda_usuarios', tiendaUsuario);
app.use('/api/tienda_productos', tiendaProducto);
app.use('/api/ingresos', ingresos);

app.use('/api/autos', auto);
app.use('/api/reduccion_inventarios', reduccionInventario);
app.use('/api/compras', compra);
app.use('/api/pedidos', pedido);
app.use('/api/traspasos', traspaso);

app.use('/api/priorizadas', dataPriorizadas);
app.use('/api/destacados', dataDestacados);
app.use('/api/p_ingresos', dataIngresos);
app.use('/api/buscar_productos', dataBusqueda);




app.use(errors);

module.exports = app;