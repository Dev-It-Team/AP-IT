var express = require('express');
var router = express.Router();
var sequelize = require('../app.js').configDatabase;
const entityName = "DownloadLogs";
const { DataTypes } = require('sequelize');

const DownloadLogs = sequelize.define(entityName, {
  IdLog: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Component: {
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
    await DownLoagLogs.sync();
  } catch(error) {
    console.log(entityName + " could not synchronize");
  }
}

async function creation(body)
{
  try 
  {
    await DownloadLogs.create({
      Date: body.Date,
      Component: body.Component
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
    await DownloadLogs.update({
      Date: body.Date,
      Component: body.Component
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
    await DownloadLogs.destroy({ 
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
      return await DownloadLogs.findAll();
  } catch(error) {
    return null;
  }
}

async function getOne(idLog)
{
  try 
  {
      return await DownloadLogs.findAll({ 
        where: {
          IdLog: idLog
      }});
  } catch(error) {
    return null;
  }
}

async function startDownload()
{
  await authentification();
  await synchronisation();
}

startDownload();


/**
 * @api {get} /downloadLogs/ Request Download Logs information
 * @apiVersion 1.0
 * @apiName GetDownloadLogs
 * @apiGroup DownloadLogs
 *
 * @apiSuccess {Number} IdLog  Unique id of the log.
 * @apiSuccess {Date} Date  Date at which the log was issued.
 * @apiSuccess {Number} Component's id.
 * @apiSuccess {String} Description  Description of the log.
 *
 * @apiError DownloadsNotAccessible The table is inaccessible due to server fault.
 */
router.get('/', function(req, res) 
{
  const allDocs = getAll();

  if (allDocs !== null)
    res.status(200).json(allDocs);
  else 
    res.status(500).json({ message: "DownloadsNotAccessible" });
});


/**
 * @api {get} /downloadLogs/:id Request specific Download Logs information
 * @apiVersion 1.0
 * @apiName GetDownloadLogs
 * @apiGroup DownloadLogs
 *
 * @apiParam {Number} id  Unique id of the log.
 * 
 * @apiSuccess {Number} IdLog  Unique id of the log.
 * @apiSuccess {Date} Date  Date at which the log was issued.
 * @apiSuccess {Number} Component's id.
 * @apiSuccess {String} Description  Description of the log.
 *
 * @apiError DownloadNotFound The log was not found.
 */
router.get('/:id', function(req, res) 
{
  const doc = getOne(req.params.id);

  if (doc !== null)
    res.status(200).json(doc);
  else 
    res.status(401).json({ message: "DownloadNotFound" });
});


/**
 * @api {post} /downloadLogs/ Create Download Logs information
 * @apiVersion 1.0
 * @apiName PostDownloadLogs
 * @apiGroup DownloadLogs
 *
 * @apiParam {Number} Component's id.
 * @apiParam {String} Description  Description of the log.
 * 
 * @apiSuccess {String} message  DownloadLogs created.
 *
 * @apiError DownloadNotCreated The log was not created.
 */
router.post('/', function(req, res) 
{
  if (creation(req.body) !== null)
    res.status(201).json({ message: entityName + "created" });
  else 
    res.status(401).json({ message: "DownloadNotCreated" });
});


/**
 * @api {put} /downloadLogs/:id Update Download Logs information
 * @apiVersion 1.0
 * @apiName PutDownloadLogs
 * @apiGroup DownloadLogs
 *
 * @apiParam {Number} IdLog  Unique id of the log.
 * @apiParam {Number} Component's id.
 * @apiParam {String} Description  Description of the log.
 * 
 * @apiSuccess {String} message  DownloadLogs updated.
 *
 * @apiError DownloadNotUpdated The log was not updated.
 */
router.put('/:id', function(req, res) 
{
  if (update(req.body, req.params.id) !== null)
    res.status(202).json({ message: entityName + "updated" });
  else 
    res.status(401).json({ message: "DownloadNotUpdated" });
});


/**
 * @api {delete} /downloadLogs/:id Delete Download Logs information
 * @apiVersion 1.0
 * @apiName DeleteDownloadLogs
 * @apiGroup DownloadLogs
 *
 * @apiParam {Number} id  Unique id of the log.
 * 
 * @apiSuccess {String} message  DownloadLogs deleted.
 *
 * @apiError DownloadNotDeleted The log was not deleted.
 */
router.delete('/:id', function(req, res)
{
  if (deletion(req.params.id) !== null)
    res.status(203).json({ message: entityName + "deleted" });
  else 
    res.status(401).json({ message: "DownloadNotDeleted" });
});

module.exports = router;