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

router.get('/:id', function(req, res) 
{
  LogsDownload.findOne({
    where: {
      IdLog: req.params.id
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

module.exports = router;