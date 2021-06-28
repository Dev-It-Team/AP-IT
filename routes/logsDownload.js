var express = require('express');
var router = express.Router({ mergeParams: true });
var sequelize = require('../app.js').configDatabase;
const entityName = "LogsDownload";
const { DataTypes } = require('sequelize');

const LogsDownload = sequelize.define(entityName, {
  IdLog: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Component: {
    type: DataTypes.STRING,
    allowNull: false
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
    await LogsDownload.sync();
  } catch(error) {
    console.error(entityName + " could not synchronize");
  }
}

async function startDownload()
{
  await authentification();
  await synchronisation();
}

startDownload();


/**
 * @api {get} /components/:IdComponent/logs Request Download Logs information
 * @apiVersion 1.1.0
 * @apiName GetDownloadLogs
 * @apiGroup LogsDownload
 *
 * @apiSuccess {Number} IdLog  Unique id of the log.
 * @apiSuccess {Date} Date  Date at which the log was issued.
 * @apiSuccess {Number} ComponentId Component's id.
 *
 * @apiError DownloadsNotAccessible The table is inaccessible due to server fault.
 */
router.get('/', function(req, res) 
{
  LogsDownload.findAll().then(function(logs) {
    return res.status(200).json(logs);
  }).catch(error => {
    return res.status(500).json({
      message: "DownloadsNotAccessible",
      stackTrace: error
    });
  });
});


/**
 * @api {get} /components/:IdComponent/downloadLogs/:id Request specific Download Logs information
 * @apiVersion 1.1.0
 * @apiName GetDownloadLogs
 * @apiGroup LogsDownload
 *
 * @apiParam {Number} id  Unique id of the log.
 * 
 * @apiSuccess {Number} IdLog  Unique id of the log.
 * @apiSuccess {Date} Date  Date at which the log was issued.
 * @apiSuccess {Number} IdComponent Component's id.
 *
 * @apiError DownloadLogNotFound The log was not found.
 */
router.get('/:id', function(req, res) 
{
  LogsDownload.findOne({
    where: {
      IdLog: req.params.id,
      Component: req.params.IdComponent
    }
  }).then(function(logs) {
    return res.status(200).json(logs);
  }).catch(error => {
    return res.status(401).json({
      message: "DownloadLogNotFound",
      stackTrace: error
    });
  });
});


/**
 * @api {post} /components/:IdComponent/downloadLogs/ Create Download Logs information
 * @apiVersion 1.1.0
 * @apiName PostDownloadLogs
 * @apiGroup LogsDownload
 *
 * @apiParam {Number} IdComponent Component's id.
 * 
 * @apiSuccess {String} message  LogsDownload created.
 *
 * @apiError DownloadNotCreated The log was not created.
 */
router.post('/', function(req, res) 
{
  LogsDownload.create({
    Date: Date.now(),
    Component: req.params.IdComponent
  }).then(response => {
    return res.status(201).json({
      message: 'LogsDownload created'
    });
  }).catch(error => {
    return res.status(401).json({
      message: 'DownloadNotCreated',
      stackTrace: error
    });
  });
});


/**
 * @api {delete} /components/:IdComponent/downloadLogs/:id Delete Download Logs information
 * @apiVersion 1.1.0
 * @apiName DeleteDownloadLogs
 * @apiGroup LogsDownload
 *
 * @apiParam {Number} id  Unique id of the log.
 * 
 * @apiSuccess {String} message  LogsDownload deleted.
 *
 * @apiError DownloadNotDeleted The log was not deleted.
 * @apiError LogsNotExisting The log does not exists.
 * @apiError DatabaseError Database issues.
 */
router.delete('/:id', function(req, res)
{
  LogsDownload.findOne({
    where: {
      IdLog: req.params.id,
      Component: req.params.IdComponent
    }
  }).then(function(log) {
    if (!log) {
      return res.status(403).json({
        message: 'LogsNotExisting'
      });
    }

    LogsDownload.destroy({
      where: {
        IdLog: req.params.id,
        Component: req.params.IdComponent
      }
    }).then(response => {
      return res.status(203).json({
        message: 'LogsDownload deleted'
      });
    }).catch(error => {
      return res.status(401).json({
        message: 'DownloadNotDeleted',
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