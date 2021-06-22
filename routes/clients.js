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
async function update(body, idUser)
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
        id: idUser
      }
    });
    return true;
  } catch(error) {
    return null;
  }
}

//DELETE request are fowarded here
async function deletion(idUser)
{
  try 
  {
    await Clients.destroy({ 
      where: {
        id: idUser
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
async function getOne(idUser)
{
  try 
  {
      return await Clients.findAll({ 
        where: {
          id: idUser
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
    res.send(JSON.stringify(allDocs, null, 2));
  else 
    res.send("Could not get " + entityName);
});


/* GET commands listing by id. */
router.get('/:id', function(req, res, next) 
{
  const doc = getOne(req.params.id);

  if (doc !== null)
    res.send(JSON.stringify(doc, null, 2));
  else 
    res.send("Could not get one " + entityName);
});


/* POST */
router.post('/', function(req, res, next) 
{
  if (creation(req.body) !== null)
    res.send(entityName + " created");
  else 
    res.send("Could not create " + entityName);
});


/* PUT */
router.put('/:id', function(req, res, next) 
{
  if (update(req.body, req.params.id) !== null)
    res.send(entityName + " id: " + req.params.id + " updated");
  else 
    res.send("Could not update " + entityName);
});


/* DELETE */
router.delete('/:id', function(req, res, next)
{
  if (deletion(req.params.id) !== null)
    res.send(entityName + " id: " + req.params.id + " deleted");
  else 
    res.send("Could not delete " + entityName);
});

module.exports = router;