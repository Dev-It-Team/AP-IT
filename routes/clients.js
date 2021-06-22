var express = require('express');
var router = express.Router();
var sequelize = require('../app.js').configDatabase;
const entityName = "Clients";
const { DataTypes } = require('sequelize');

//ORM entity config
const Clients = sequelize.define(entityName, {
  IdClient: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  idUser: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  AdresseFacturation: {
    type: DataTypes.STRING,
    allowNull: false
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
      idUser: body.idUser,
      AdresseFacturation: body.AdresseFacturation,
    });
    return true;
  } catch(error) {
    return null;
  }
}

//PUT request are fowarded here
async function update(body, IdClient)
{
  try 
  {
    await Clients.update({
      idUser: body.idUser,
      AdresseFacturation: body.AdresseFacturation,
    }, {
      where: {
        id: IdClient
      }
    });
    return true;
  } catch(error) {
    return null;
  }
}

//DELETE request are fowarded here
async function deletion(IdClient)
{
  try 
  {
    await Clients.destroy({ 
      where: {
        IdClient: IdClient
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
async function getOne(IdClient)
{
  try 
  {
      return await Clients.findAll({ 
        where: {
          IdClient: IdClient
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
 * @api {get} /clients/ Get Clients information
 * @apiName GetClients
 * @apiGroup Clients
 *
 * @apiSuccess {Number} IdClient  Unique id of the client.
 * @apiSuccess {Number} IdUser Unique id of the user connected to this client.
 * @apiSuccess {String} AdresseFecturation  Adress where this client is facturated.
 *
 * @apiError ClientsNotAccessible The table is inaccessible due to server fault.
 */
router.get('/', function(req, res) 
{
  const allDocs = getAll();

  if (allDocs !== null || allDocs.length == 0)
    res.status(200).json(allDocs);
  else 
    res.status(500).json({ message: "ClientsNotAccessible" });
});


/**
 * @api {get} /clients/:id Get specific Client information
 * @apiName GetClient
 * @apiGroup Clients
 *
 * @apiParam {Number} id Client unique ID.
 * 
 * @apiSuccess {Number} IdClient  Unique id of the client.
 * @apiSuccess {Number} IdUser Unique id of the user connected to this client.
 * @apiSuccess {String} AdresseFecturation  Adress where this client is facturated.
 *
 * @apiError ClientNotFound The client seeked was not found.
 */
router.get('/:id', function(req, res) 
{
  const doc = getOne(req.params.id);

  if (doc !== null || doc.length == 0)
    res.status(200).json(doc);
  else 
    res.status(401).json({ message: "ClientNotFound "});
});


/**
 * @api {post} /clients/ Create Client information
 * @apiName PostClient
 * @apiGroup Clients
 *
 * @apiParam {Number} IdClient  Unique id of the client.
 * @apiParam {Number} IdUser Unique id of the user connected to this client.
 * @apiParam {String} AdresseFecturation  Adress where this client is facturated.
 * 
 * @apiSuccess {String} message  Clients created.
 *
 * @apiError ClientNotCreated The client cannot be created.
 */
router.post('/', function(req, res) 
{
  if (creation(req.body) !== null)
    res.status(201).json({ message: entityName + " created" });
  else 
    res.status(401).json({message: "ClientNotCreated" });
});


/**
 * @api {put} /clients/:id Update Client information
 * @apiName PutClient
 * @apiGroup Clients
 *
 * @apiParam {Number} id Client unique ID.
 * @apiParam {Number} IdClient  Unique id of the client.
 * @apiParam {Number} IdUser Unique id of the user connected to this client.
 * @apiParam {String} AdresseFecturation  Adress where this client is facturated.
 * 
 * @apiSuccess {String} message  Clients updated.
 *
 * @apiError ClientNotUpdated The client cannot be updated.
 */
router.put('/:id', function(req, res) 
{
  if (update(req.body, req.params.id) !== null)
    res.status(202).json({ message: entityName + " updated" });
  else 
    res.status(401).json({ message: "ClientNotUpdated" });
});


/**
 * @api {delete} /clients/ Delete Client information
 * @apiName DeleteClient
 * @apiGroup Clients
 *
 * @apiParam {Number} id Client unique ID.
 * 
 * @apiSuccess {String} message  Clients deleted.
 *
 * @apiError ClientNotCreated The client cannot be deleted.
 */
router.delete('/:id', function(req, res)
{
  if (deletion(req.params.id) !== null)
    res.status(203).json({ message: entityName + " deleted" });
  else 
    res.status(401).json({ message: "ClientNotDeleted" });
});

module.exports = router;