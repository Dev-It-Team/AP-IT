var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { checkTokenMiddleware, checkUserRoleFlag } = require('./jwtMiddleware');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

//Config for NoSQL ORM
require('mongoose').connect("mongodb+srv://admin:admin@js-project.rztwo.mongodb.net/project", { useNewUrlParser: true, useUnifiedTopology: true });

// get config vars
dotenv.config();
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Config for SQL ORM
const config = new Sequelize('BaseSQL', 'sa', 'Password', {
  host: 'localhost',
  dialect: 'mssql',
  port: '1433',
  logging: false
});

//Export here because of routes
exports.configDatabase = config;

//Every routes for the API
// Roles
const rolesFlags = {
    CLIENTS: 0,
    RESTAURANTS: 1,
    DELIVERY: 2,
    MARKETING: 3,
    TECHNIC: 4,
    DEVELOPER: 5
}

//Routes not secured by login
app.use('/',                require('./routes/index'));
app.use('/login',           require('./routes/users/login'));

//Routes secured by login and roles
app.use('/users/', checkTokenMiddleware, checkUserRoleFlag(rolesFlags.MARKETING), require(`./routes/users/users`));
[
    '/menus',
    '/products',
    '/orders',
    '/components',
    '/restaurants',
    '/deliveryDrivers',
    '/logsConnection',
    '/logsDownload',
].forEach((protectedRoute) => app.use(protectedRoute, checkTokenMiddleware, require(`./routes${protectedRoute}`)));

// catch 404 and forward to error handler
app.use(function(req, res) 
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
    res.send({ "error": err.message });
  }
  else 
  {
    res.status(500);
    res.send({ "error": "Internal Error" });
  }
});

module.exports = app;