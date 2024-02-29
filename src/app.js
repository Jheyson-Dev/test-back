const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const config = require('./config');

const authRoutes = require('./module/auth/routes');
const usuarios = require('./module/usuario/routes');
const marcaAuto = require('./module/marcaAuto/routes');
const modeloAuto = require('./module/modeloAuto/routes');
const auto = require('./module/auto/routes');
const categorias = require('./module/categoria/routes');
const productos = require('./module/producto/routes');
const aplicaciones = require('./module/aplicacion/routes');
const imgProducto = require('./module/imgProducto/routes');
const reemplazos = require('./module/reemplazo/routes');
const ingresos = require('./module/ingreso/routes');

const dataDestacados = require('./module/data/dataProductosDestacadosRoutes');


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
app.use('/api/marca-autos', marcaAuto);
app.use('/api/modelo-autos', modeloAuto);
app.use('/api/autos', auto);
app.use('/api/categorias', categorias);
app.use('/api/productos', productos);
app.use('/api/aplicaciones', aplicaciones);
app.use('/api/img-productos', imgProducto);
app.use('/api/reemplazos', reemplazos);
app.use('/api/ingresos', ingresos);

app.use('/api/destacados', dataDestacados);

app.use(errors);

module.exports = app;