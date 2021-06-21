var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter       = require('./routes/index');
var productsRouter    = require('./routes/products');
var commandsRouter    = require('./routes/commands');
var componentsRouter  = require('./routes/components');
var menusRouter       = require('./routes/menus');
var usersRouter       = require('./routes/users');
var clientsRouter     = require('./routes/clients');
var restaurantsRouter = require('./routes/restaurants');
var deliversRouter    = require('./routes/delivers');
var connectionRouter  = require('./routes/connectionLogs');
var downloadRouter    = require('./routes/downloadLogs');

const mongoose = require('mongoose');
const mongoString = "mongodb+srv://admin:admin@js-project.rztwo.mongodb.net/project"

mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/menus', menusRouter);
app.use('/products', productsRouter);
app.use('/commands', commandsRouter);
app.use('/components', componentsRouter);
app.use('/users', usersRouter);
app.use('/clients', clientsRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/delivers', deliversRouter);
app.use('/connectionLogs', connectionRouter);
app.use('/downloadLogs', downloadRouter);

var sql = require('mssql');

var config = {
    server: 'localhost',
    database: 'ap\'it',
    user: 'root',
    password: 'root',
    port: 1433
};

var dbConn = new sql.ConnectionPool(config);

dbConn.connect().then(function () 
{
    var request = new sql.Request(dbConn);

    request.query("select * from tests").then(function (recordSet) 
    {
        console.log(recordSet);
        dbConn.close();
    }).catch(function (err) 
    {
        console.log(err);
        dbConn.close();
    });
}).catch(function (err) 
{
    console.log(err);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) 
{
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) 
{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;