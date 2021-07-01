var express = require('express');
var router = express.Router({ mergeParams: true });
var sequelize = require('../app.js').configDatabase;
const entityName = "LogsConnection";
const { DataTypes } = require('sequelize');

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

router.get('/:IdLog', function(req, res) 
{
  LogsConnection.findOne({
    where: {
      IdLog: req.params.IdLog
    }
  }).then(function(logs) {
    return res.status(200).json(logs);
  }).catch(error => {
    return res.status(401).json({
      message: 'ConnectionNotFound'
    });
  });
});

module.exports = router;