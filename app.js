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
//Routes not secured by login
app.use('/',                require('./routes/index'));
app.use('/login',           require('./routes/users/login'));

var restaurantRouter = express.Router();
var productRouter = express.Router({ mergeParams: true });
var menusRouter = express.Router({ mergeParams: true });

var userRouter = express.Router();
var logRouter = express.Router({ mergeParams: true });
var orderRouter = express.Router({ mergeParams: true });

var componentRouter = express.Router();
var dlRouter = express.Router({ mergeParams: true });

restaurantRouter.use('/:restauId/products', productRouter);
restaurantRouter.use('/:restauId/menus', menusRouter);

userRouter.use('/:userId/logs', logRouter);
userRouter.use('/:userId/orders', orderRouter);

componentRouter.use('/:componentId/logs', dlRouter);


restaurantRouter.route('/').get(function (req, res) {
  res.status(200).send("Restaurants");
});

restaurantRouter.route('/:restauId').get(function (req, res) {
  res.status(200).send("Restaurant " + req.params.restauId);
});

productRouter.route('/').get(function (req, res) {
  res.status(200).send("Restaurant " + req.params.restauId + " products");
});

productRouter.route('/:productId').get(function (req, res) {
  res.status(200).send("Restaurant " + req.params.restauId + " product " + req.params.productId);
});

menusRouter.route('/').get(function (req, res) {
  res.status(200).send("Restaurant " + req.params.restauId + " menus");
});

menusRouter.route('/:menuId').get(function (req, res) {
  res.status(200).send("Restaurant " + req.params.restauId + " menu " + req.params.menuId);
});

app.use('/restaurants', restaurantRouter);



userRouter.route('/').get(function (req, res) {
  res.status(200).send("Users");
});

userRouter.route('/:userId').get(function (req, res) {
  res.status(200).send("User " + req.params.userId);
});

logRouter.route('/').get(function (req, res) {
  res.status(200).send("User " + req.params.userId + " log");
});

logRouter.route('/:logId').get(function (req, res) {
  res.status(200).send("User " + req.params.userId + " log " + req.params.logId);
});

orderRouter.route('/').get(function (req, res) {
  res.status(200).send("User " + req.params.userId + " menus");
});

orderRouter.route('/:orderId').get(function (req, res) {
  res.status(200).send("User " + req.params.userId + " menu " + req.params.orderId);
});

app.use('/users', userRouter);



componentRouter.route('/').get(function (req, res) {
  res.status(200).send("Components");
});

componentRouter.route('/:componentId').get(function (req, res) {
  res.status(200).send("Component " + req.params.componentId);
});

dlRouter.route('/').get(function (req, res) {
  res.status(200).send("Component " + req.params.componentId + " log");
});

dlRouter.route('/:logId').get(function (req, res) {
  res.status(200).send("Component " + req.params.componentId + " log " + req.params.logId);
});

app.use('/components', componentRouter);

/*
//Routes secured by login
app.use('/users/', checkTokenMiddleware, require(`./routes/users/users`));
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
*/
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