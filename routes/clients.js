var express = require('express');
var router = express.Router();
var sequelize = require('../app.js').configDatabase;
const entityName = "Clients";
const { DataTypes } = require('sequelize');

//ORM entity config
const Clients = sequelize.define(entityName, {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  adresse_facturation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code_parainage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nb_parainages: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
}, {
    tableName: entityName
});

//Authentification method in async
async function authentification()
{
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database');
  }
}

//Synchronisation method, used to create table if needed
async function synchronisation()
{
  try {
    await Clients.sync();
  } catch(error) {
    console.log(entityName + " could not synchronize");
  }
}

//POST request are fowarded here
async function creation(body)
{
  try 
  {
    await Clients.create({
      id_user: body.id_user,
      adresse_facturation: body.adresse_facturation,
      code_parainage: body.code_parainage,
      nb_parainages: body.nb_parainages
    });
    return true;
  } catch(error) {
    return null;
  }
}

//PUT request are fowarded here
async function update(body, idClient)
{
  try 
  {
    await Clients.update({
      id_user: body.id_user,
      adresse_facturation: body.adresse_facturation,
      code_parainage: body.code_parainage,
      nb_parainages: body.nb_parainages
    }, {
      where: {
        id: idClient
      }
    });
    return true;
  } catch(error) {
    return null;
  }
}

//DELETE request are fowarded here
async function deletion(idClient)
{
  try 
  {
    await Clients.destroy({ 
      where: {
        id: idClient
    }});
    return true;
  } catch(error) {
    return null;
  }
}

//GET request are fowarded here
async function getAll()
{
  try 
  {
      return await Clients.findAll();
  } catch(error) {
    return null;
  }
}

//GET request are fowarded here
async function getOne(idClient)
{
  try 
  {
      return await Clients.findAll({ 
        where: {
          id: idClient
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
    res.status(401).json({message: "Could not create " + entityName });
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
    res.status(203).json({ message: entityName + " deleted" });
  else 
    res.status(401).json({ message: "Could not delete " + entityName });
});

module.exports = router;