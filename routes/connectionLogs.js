var express = require('express');
var router = express.Router();
var sequelize = require('../app.js').configDatabase;
const entityName = "ConnectionLogs";
const { DataTypes } = require('sequelize');

const ConnectionLogs = sequelize.define(entityName, {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  datetime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_user: {
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
      datetime: body.datetime,
      text: body.text,
      id_user: body.id_user
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
      datetime: body.datetime,
      text: body.text,
      id_user: body.id_user
    }, {
      where: {
        id: idLog
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
        id: idLog
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
          id: idLog
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
    res.status(200).send(JSON.stringify(allDocs, null, 2));
  else 
    res.status(401).send("Could not get " + entityName);
});


/* GET commands listing by id. */
router.get('/:id', function(req, res, next) 
{
  const doc = getOne(req.params.id);

  if (doc !== null)
    res.status(200).send(JSON.stringify(doc, null, 2));
  else 
    res.status(401).send("Could not get one " + entityName);
});


/* POST */
router.post('/', function(req, res, next) 
{
  if (creation(req.body) !== null)
    res.status(201).send(entityName + " created");
  else 
    res.status(401).send("Could not create " + entityName);
});


/* PUT */
router.put('/:id', function(req, res, next) 
{
  if (update(req.body, req.params.id) !== null)
    res.status(202).send(entityName + " id: " + req.params.id + " updated");
  else 
    res.status(401).send("Could not update " + entityName);
});


/* DELETE */
router.delete('/:id', function(req, res, next)
{
  if (deletion(req.params.id) !== null)
    res.status(203).send(entityName + " id: " + req.params.id + " deleted");
  else 
    res.status(401).send("Could not delete " + entityName);
});

module.exports = router;