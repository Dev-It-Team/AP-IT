var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { checkTokenMiddleware, checkUserRoleFlag } = require('./jwtMiddleware');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
var busboy = require('connect-busboy');

var cors = require('cors')
const corsOptions = {
  origin: true,
  credentials: true
}

//Config for NoSQL ORM
require('mongoose').connect("mongodb+srv://admin:admin@js-project.rztwo.mongodb.net/project", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// get config vars
dotenv.config();
var app = express();

app.options('*', cors(corsOptions)); // preflight OPTIONS; put before other routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS Handling (requests from external network and web browsers)
app.use(function(req, res, next) {
    // Allow everyone
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Request-Headers', '*');
    res.header('Access-Control-Request-Methods', '*');
    next();
});

//Config for SQL ORM
const config = new Sequelize('BaseSQL', 'sa', 'Password', {
    host: 'localhost',
    dialect: 'mssql',
    port: '1433',
    logging: false
});

//Export here because of routes
exports.configDatabase = config;

// Roles
const rolesFlags = {
    CLIENTS: 0,
    RESTAURANTS: 1,
    DELIVERY: 2,
    MARKETING: 3,
    TECHNIC: 4,
    DEVELOPER: 5
}

//Every routes for the API
const usersRouter = require('./routes/users/users');
const restaurantsRouter = require('./routes/restaurants/restaurants');
const deliveryDriversRouter = require('./routes/deliveryDrivers');
const componentsRouter = require('./routes/components');
const uploadRouter = require('./routes/uploadFiles');

//Routes not secured by login
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/users/login'));
//Protected routes
app.use('/restaurants',     checkTokenMiddleware,    restaurantsRouter);
app.use('/upload',     checkTokenMiddleware, busboy(),  uploadRouter);
app.use('/users',           checkTokenMiddleware,   usersRouter);
app.use('/deliveryDrivers', checkTokenMiddleware,   deliveryDriversRouter);
app.use('/components',      checkTokenMiddleware,   componentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.status(404);
    res.send({
        "error": "Route not found"
    });
});

// error handler
app.use(function (err, req, res, next) {
    if (req.app.get('env') === 'development') {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.send({
            "error": err.message
        });
    } else {
        res.status(500);
        res.send({
            "error": "Internal Error"
        });
    }
});


module.exports = app;