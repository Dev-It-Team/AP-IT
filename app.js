var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { checkTokenMiddleware } = require('./jwtMiddleware');
const { Sequelize } = require('sequelize');

//Config for NoSQL ORM
require('mongoose').connect("mongodb+srv://admin:admin@js-project.rztwo.mongodb.net/project", { useNewUrlParser: true, useUnifiedTopology: true });

const dotenv = require('dotenv');
// get config vars
dotenv.config();
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Config for SQL ORM
const config = new Sequelize('Test', 'sa', 'Str0ng_p4ssw0rd', {
  host: 'localhost',
  dialect: 'mssql',
  port: '1433',
  logging: false
});

//Export here because of routes
exports.configDatabase = config;

//Every routes for the API
app.use('/',                require('./routes/index'));
app.use('/menus',           require('./routes/menus'));
app.use('/products',        require('./routes/products'));
app.use('/commands',        require('./routes/commands'));
app.use('/components',      require('./routes/components'));
app.use('/users',           require('./routes/users'));
app.use('/clients',         require('./routes/clients'));
app.use('/restaurants',     require('./routes/restaurants'));
app.use('/delivers',        require('./routes/delivers'));
app.use('/connectionLogs',  require('./routes/connectionLogs'));
app.use('/downloadLogs',    require('./routes/downloadLogs'));

// catch 404 and forward to error handler
app.use(function(req, res, next) 
{
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) 
{
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;