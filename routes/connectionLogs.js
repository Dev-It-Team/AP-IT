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


/* GET commands listing. */
router.get('/', function(req, res, next) 
{
  const allDocs = getAll();

  if (allDocs !== null)
    res.status(200).json(allDocs);
  else 
    res.status(401).json({ message: "Could not get " + entityName });
});


/* GET commands listing by id. */
router.get('/:id', function(req, res, next) 
{
  const doc = getOne(req.params.id);

  if (doc !== null)
    res.status(200).json(doc);
  else 
    res.status(401).json({ message: "Could not get one " + entityName });
});


/* POST */
router.post('/', function(req, res, next) 
{
  if (creation(req.body) !== null)
    res.status(201).json({ message: entityName + " created" });
  else 
    res.status(401).json({ message: "Could not create " + entityName });
});


/* PUT */
router.put('/:id', function(req, res, next) 
{
  if (update(req.body, req.params.id) !== null)
    res.status(202).json({ message: entityName + " updated" });
  else 
    res.status(401).json({ message: "Could not update " + entityName });
});


/* DELETE */
router.delete('/:id', function(req, res, next)
{
  if (deletion(req.params.id) !== null)
    res.status(203).json({ message: entityName + "deleted" });
  else 
    res.status(401).json({ message: "Could not delete " + entityName });
});

module.exports = router;