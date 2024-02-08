const express = require('express');
const morgan = require('morgan')
const config = require('./config');
const personas = require('./module/persona/routes');
const errors = require('./red/errors');

const app = express();
//middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//configuración
app.set('port', config.app.port);

//rutas
app.use('/api/personas', personas);
app.use(errors);

module.exports = app;