var express = require('express');
var router = express.Router({ mergeParams: true });
var sequelize = require('../app.js').configDatabase;
const entityName = "LogsConnection";
const { DataTypes, Sequelize } = require('sequelize');

const LogsConnection = sequelize.define(entityName, {
  IdLog: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  IdUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
    foreignKey: 'Users',
    sourceKey: 'IdUser'
  },
}, {
    tableName: entityName,
    createdAt: false,
    updatedAt: false,
});

async function authentification()
{
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database');
  }
}

async function synchronisation()
{
  try {
    await LogsConnection.sync();
  } catch(error) {
    console.error(entityName + " could not synchronize");
  }
}

async function startConnection()
{
  await authentification();
  await synchronisation();
}

startConnection();


/**
 * @api {get} /connectionLogs/ Request Connection Logs information
 * @apiVersion 1.0.0
 * @apiName GetConnectionLogs
 * @apiGroup LogsConnection
 *
 * @apiSuccess {Number} IdLog  Unique id of the log.
 * @apiSuccess {Number} IdUser  Unique id of the user related to this log.
 * @apiSuccess {Date} Date  Date when the log was saved.
 * @apiSuccess {String} Description  Description of the log.
 *
 * @apiError ConnectionsNotAccessible The model is inaccessible due to server fault.
 */
/**
 * @api {get} /users/:IdUser/logs/ Request Connection Logs information
 * @apiVersion 1.1.0
 * @apiName GetConnectionLogs
 * @apiGroup LogsConnection
 *
 * @apiSuccess {Number} IdLog  Unique id of the log.
 * @apiSuccess {Number} IdUser  Unique id of the user related to this log.
 * @apiSuccess {Date} Date  Date when the log was saved.
 * @apiSuccess {String} Description  Description of the log.
 *
 * @apiError ConnectionNotAccessible The database is inaccessible due to server fault.
 */
router.get('/', function(req, res) 
{
  LogsConnection.findAll().then(function(logs) {
    return res.status(200).json(logs);
  }).catch(error => {
    return res.status(500).json({
      message: "ConnectionNotAccessible",
      stackTrace: error
    });
  });
});


/**
 * @api {get} /connectionLogs/:id Request Connection Logs information
 * @apiVersion 1.0.0
 * @apiName GetConnectionLogs
 * @apiGroup LogsConnection
 *
 * @apiParam {Number} id  Unique id of the log.
 * 
 * @apiSuccess {Number} IdLog  Unique id of the log.
 * @apiSuccess {Number} IdUser  Unique id of the user related to this log.
 * @apiSuccess {Date} Date  Date when the log was saved.
 * @apiSuccess {String} Description  Description of the log.
 *
 * @apiError ConnectionNotFound The log was not found.
 */
/**
 * @api {get} /users/:IdUser/logs/:id Request Connection Logs information
 * @apiVersion 1.1.0
 * @apiName GetConnectionLogs
 * @apiGroup LogsConnection
 *
 * @apiParam {Number} IdLog  Unique id of the log.
 * 
 * @apiSuccess {Number} IdLog  Unique id of the log.
 * @apiSuccess {Number} IdUser  Unique id of the user related to this log.
 * @apiSuccess {Date} Date  Date when the log was saved.
 * @apiSuccess {String} Description  Description of the log.
 *
 * @apiError ConnectionNotFound The log was not found.
 */
router.get('/:IdLog', function(req, res) 
{
  LogsConnection.findOne({
    where: {
      IdLog: req.params.IdLog,
      IdUser: req.params.IdUser
    }
  }).then(function(delivers) {
    return res.status(200).json(delivers);
  }).catch(error => {
    return res.status(401).json({
      message: 'ConnectionNotFound'
    });
  });
});


/**
 * @api {post} /connectionLogs/ Create Connection Logs information
 * @apiVersion 1.0.0
 * @apiName PostConnectionLogs
 * @apiGroup LogsConnection
 *
 * @apiParam {Number} IdUser  Unique id of the user related to this log.
 * @apiParam {Date} Date  Date when the log was saved.
 * @apiParam {String} Description  Description of the log.
 * 
 * @apiSuccess {String} message  LogsConnection created.
 *
 * @apiError ConnectionNotCreated The log was not created.
 */
/**
 * @api {post} /users/:IdUser/logs/ Create Connection Logs information
 * @apiVersion 1.1.0
 * @apiName PostConnectionLogs
 * @apiGroup LogsConnection
 *
 * @apiParam {Number} IdUser  Unique id of the user related to this log.
 * @apiParam {Date} Date  Date when the log was saved.
 * @apiParam {String} Description  Description of the log.
 * 
 * @apiSuccess {String} message  LogsConnection created.
 *
 * @apiError ConnectionNotCreated The log was not created.
 */
router.post('/', function(req, res) 
{
  LogsConnection.create({
    Date: Date.now(),
    IdUser: parseInt(req.params.IdUser),
    Description: req.body.Description
  }).then(response => {
    return res.status(201).json({
      message: 'ConnectionLog created'
    });
  }).catch(error => {
    return res.status(401).json({
      message: 'ConnectionNotCreated',
      stackTrace: error
    });
  });
});

Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
  date = this._applyTimezone(date, options);
  return date.format('YYYY-MM-DD HH:mm:ss.SSS');
};


/**
 * @api {delete} /connectionLogs/:id Delete Connection Logs information
 * @apiVersion 1.0.0
 * @apiName DeleteConnectionLogs
 * @apiGroup LogsConnection
 *
 * @apiParam {Number} id  Unique id of the log.
 * 
 * @apiSuccess {String} message  LogsConnection deleted.
 *
 * @apiError ConnectionNotDeleted The log was not deleted.
 */
/**
 * @api {delete} /users/:IdUser/logs/:id Delete Connection Logs information
 * @apiVersion 1.1.0
 * @apiName DeleteConnectionLogs
 * @apiGroup LogsConnection
 *
 * @apiParam {Number} id  Unique id of the log.
 * 
 * @apiSuccess {String} message  LogsConnection deleted.
 *
 * @apiError ConnectionNotDeleted The log was not deleted.
 * @apiError LogsNotExisting The log does not exists.
 * @apiError DatabaseError Database issues.
 */
router.delete('/:id', function(req, res)
{
  LogsConnection.findOne({
    where: {
      IdLog: req.params.IdLog,
      IdUser: req.params.IdUser
    }
  }).then(function(log) {
    if (!log) {
      return res.status(403).json({
        message: 'LogsNotExisting'
      });
    }

    LogsConnection.destroy({
      where: {
        IdLog: req.params.IdLog,
        IdUser: req.params.IdUser
      }
    }).then(response => {
      return res.status(203).json({
        message: 'Connection deleted'
      });
    }).catch(error => {
      return res.status(401).json({
        message: 'ConnectionNotDeleted',
        stackTrace: error
      });
    });
  }).catch(error => {
    return res.status(500).json({
      message: 'DatabaseError',
      stackTrace: error
    });
  });
});

module.exports = router;