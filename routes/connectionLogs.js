var express = require('express');
var router = express.Router();
var sequelize = require('../app.js').configDatabase;
const entityName = "ConnectionLogs";
const { DataTypes } = require('sequelize');

const ConnectionLogs = sequelize.define(entityName, {
  IdLog: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    allowNull: false
  },
}, {
    tableName: entityName
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
    await ConnectionLogs.sync();
  } catch(error) {
    console.log(entityName + " could not synchronize");
  }
}

async function creation(body)
{
  try 
  {
    await ConnectionLogs.create({
      Date: body.Date,
      Description: body.Description,
      IdUser: body.IdUser
    });
    return true;
  } catch(error) {
    return null;
  }
}

async function update(body, idLog)
{
  try 
  {
    await ConnectionLogs.update({
      Date: body.Date,
      Description: body.Description,
      IdUser: body.IdUser
    }, {
      where: {
        IdLog: idLog
      }
    });
    return true;
  } catch(error) {
    return null;
  }
}

async function deletion(idLog)
{
  try 
  {
    await ConnectionLogs.destroy({ 
      where: {
        IdLog: idLog
    }});
    return true;
  } catch(error) {
    return null;
  }
}

async function getAll()
{
  try 
  {
      return await ConnectionLogs.findAll();
  } catch(error) {
    return null;
  }
}

async function getOne(idLog)
{
  try 
  {
      return await ConnectionLogs.findAll({ 
        where: {
          IdLog: idLog
      }});
  } catch(error) {
    return null;
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
 * @apiGroup ConnectionLogs
 *
 * @apiSuccess {Number} IdLog  Unique id of the log.
 * @apiSuccess {Number} IdUser  Unique id of the user related to this log.
 * @apiSuccess {Date} Date  Date when the log was saved.
 * @apiSuccess {String} Description  Description of the log.
 *
 * @apiError ConnectionsNotAccessible The model is inaccessible due to server fault.
 */
router.get('/', function(req, res, next) 
{
  const allDocs = getAll();

  if (allDocs !== null || docs.length == 0)
    res.status(200).json(allDocs);
  else 
    res.status(500).json({ message: "ConnectionsNotAccessible" });
});


/**
 * @api {get} /connectionLogs/:id Request Connection Logs information
 * @apiVersion 1.0.0
 * @apiName GetConnectionLogs
 * @apiGroup ConnectionLogs
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
router.get('/:id', function(req, res, next) 
{
  const doc = getOne(req.params.id);

  if (doc !== null || doc.length == 0)
    res.status(200).json(doc);
  else 
    res.status(401).json({ message: "ConnectionNotFound" });
});


/**
 * @api {post} /connectionLogs/ Create Connection Logs information
 * @apiVersion 1.0.0
 * @apiName PostConnectionLogs
 * @apiGroup ConnectionLogs
 *
 * @apiParam {Number} IdUser  Unique id of the user related to this log.
 * @apiParam {Date} Date  Date when the log was saved.
 * @apiParam {String} Description  Description of the log.
 * 
 * @apiSuccess {String} message  ConnectionLogs created.
 *
 * @apiError ConnectionNotCreated The log was not created.
 */
router.post('/', function(req, res) 
{
  if (creation(req.body) !== null)
    res.status(201).json({ message: entityName + " created" });
  else 
    res.status(401).json({ message: "ConnectionNotCreated" });
});


/**
 * @api {put} /connectionLogs/:id Update Connection Logs information
 * @apiVersion 1.0.0
 * @apiName PutConnectionLogs
 * @apiGroup ConnectionLogs
 *
 * @apiParam {Number} id  Unique id of the log.
 * @apiParam {Number} IdUser  Unique id of the user related to this log.
 * @apiParam {Date} Date  Date when the log was saved.
 * @apiParam {String} Description  Description of the log.
 * 
 * @apiSuccess {String} message  ConnectionLogs updated.
 *
 * @apiError ConnectionNotUpdated The log was not updated.
 */
router.put('/:id', function(req, res) 
{
  if (update(req.body, req.params.id) !== null)
    res.status(202).json({ message: entityName + " updated" });
  else 
    res.status(401).json({ message: "ConnectionNotUpdated" });
});


/**
 * @api {delete} /connectionLogs/:id Delete Connection Logs information
 * @apiVersion 1.0.0
 * @apiName DeleteConnectionLogs
 * @apiGroup ConnectionLogs
 *
 * @apiParam {Number} id  Unique id of the log.
 * 
 * @apiSuccess {String} message  ConnectionLogs deleted.
 *
 * @apiError ConnectionNotDeleted The log was not deleted.
 */
router.delete('/:id', function(req, res)
{
  if (deletion(req.params.id) !== null)
    res.status(203).json({ message: entityName + "deleted" });
  else 
    res.status(401).json({ message: "ConnectionNotDeleted" });
});

module.exports = router;