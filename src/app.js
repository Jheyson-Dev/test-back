const express = require('express');
const morgan = require('morgan')
const config = require('./config');

const authRoutes = require('./module/auth/routes');
const personas = require('./module/persona/routes');
const empresas = require('./module/empresa/routes');
const categorias = require('./module/categoria/routes');
const usuarios = require('./module/usuario/routes');

const errors = require('./red/errors');

const app = express();
//middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//configuración
app.set('port', config.app.port);

//rutas
app.use('/api/auth', authRoutes); 
app.use('/api/usuarios', usuarios);
app.use('/api/personas', personas);
app.use('/api/empresas', empresas);
app.use('/api/categorias', categorias);

app.use(errors);

module.exports = app;