var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { checkTokenMiddleware } = require('./jwtMiddleware');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

//Config for NoSQL ORM
require('mongoose').connect("mongodb+srv://admin:admin@js-project.rztwo.mongodb.net/project", { useNewUrlParser: true, useUnifiedTopology: true });

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
//Routes not secured by login
app.use('/',                require('./routes/index'));
app.use('/users',           require('./routes/users'));

//Routes secured by login
app.use('/menus',           checkTokenMiddleware, require('./routes/menus'));
app.use('/products',        checkTokenMiddleware, require('./routes/products'));
app.use('/commands',        checkTokenMiddleware, require('./routes/commands'));
app.use('/components',      checkTokenMiddleware, require('./routes/components'));
app.use('/clients',         checkTokenMiddleware, require('./routes/clients'));
app.use('/restaurants',     checkTokenMiddleware, require('./routes/restaurants'));
app.use('/deliveryDrivers', checkTokenMiddleware, require('./routes/deliveryDrivers'));
app.use('/connectionLogs',  checkTokenMiddleware, require('./routes/connectionLogs'));
app.use('/downloadLogs',    checkTokenMiddleware, require('./routes/downloadLogs'));

// catch 404 and forward to error handler
app.use(function(req, res, next) 
{
  res.status(404);
  res.send({ "error": "Route not found" });
});

// error handler
app.use(function(err, req, res, next) 
{
  if (req.app.get('env') === 'development')
  {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
  else 
  {
    res.status(500);
    res.send({ "error": "Internal Error" });
  }
});

module.exports = app;