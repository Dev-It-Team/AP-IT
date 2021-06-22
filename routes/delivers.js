var express = require('express');
var router = express.Router();
var sequelize = require('../app.js').configDatabase;
const entityName = "Livreurs";
const { DataTypes } = require('sequelize');

const Livreurs = sequelize.define(entityName, {
  IdLivreur: {
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
  TypeVehicule: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Note: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  NbVotes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
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
    await Livreurs.sync();
  } catch(error) {
    console.log(entityName + " could not synchronize");
  }
}

async function creation(body)
{
  try 
  {
    await Livreurs.create({
      idUser: body.idUser,
      AdresseFacturation: body.AdresseFacturation,
      TypeVehicule: body.TypeVehicule,
      Note: body.Note,
      NbVotes: body.NbVotes,
    });
    return true;
  } catch(error) {
    return null;
  }
}

async function update(body, idDeliver)
{
  try 
  {
    await Livreurs.update({
      idUser: body.idUser,
      AdresseFacturation: body.AdresseFacturation,
      TypeVehicule: body.TypeVehicule,
      Note: body.Note,
      NbVotes: body.NbVotes,
    }, {
      where: {
        IdLivreur: idDeliver
      }
    });
    return true;
  } catch(error) {
    return null;
  }
}

async function deletion(idDeliver)
{
  try 
  {
    await Livreurs.destroy({ 
      where: {
        IdLivreur: idDeliver
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
      return await Livreurs.findAll();
  } catch(error) {
    return null;
  }
}

async function getOne(idDeliver)
{
  try 
  {
      return await Livreurs.findAll({ 
        where: {
          IdLivreur: idDeliver
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
 * @api {get} /delivers/ Recover Delivers information
 * @apiName GetDelivers
 * @apiGroup Delivers
 *
 * @apiSuccess {Number} IdLivreur  Unique id of the deliver.
 * @apiSuccess {Number} IdUser  Unique id of the user related to this deliver.
 * @apiSuccess {String} AdresseFacturation  Adress of facturation.
 * @apiSuccess {String} TypeVehicule  Type of vehicule used.
 * @apiSuccess {Number} Note  Total votes on this deliver.
 * @apiSuccess {Number} NbVotes  Number of votes on this deliver.
 *
 * @apiError DeliversNotAccessible The table is inaccessible due to server fault.
 */
router.get('/', function(req, res) 
{
  const allDocs = getAll();

  if (allDocs !== null || allDocs.length == 0)
    res.status(200).json(allDocs);
  else 
    res.status(500).json({ message: "DeliversNotAccessible" });
});


/**
 * @api {get} /delivers/:id Recover specific Deliver information
 * @apiName GetDeliver
 * @apiGroup Delivers
 *
 * @apiParam {Number} IdLivreur  Unique id of the deliver.
 * 
 * @apiSuccess {Number} IdLivreur  Unique id of the deliver.
 * @apiSuccess {Number} IdUser  Unique id of the user related to this deliver.
 * @apiSuccess {String} AdresseFacturation  Adress of facturation.
 * @apiSuccess {String} TypeVehicule  Type of vehicule used.
 * @apiSuccess {Number} Note  Total votes on this deliver.
 * @apiSuccess {Number} NbVotes  Number of votes on this deliver.
 *
 * @apiError DeliverNotFound The deliver wanted was not found.
 */
router.get('/:id', function(req, res) 
{
  const doc = getOne(req.params.id);

  if (doc !== null || doc.length == 0)
    res.status(200).json(doc);
  else 
    res.status(401).json({ message: "DeliverNotFound" });
});


/**
 * @api {post} /delivers/ Create Deliver information
 * @apiName PostDeliver
 * @apiGroup Delivers
 *
 * @apiParam {Number} IdUser  Unique id of the user related to this deliver.
 * @apiParam {String} AdresseFacturation  Adress of facturation.
 * @apiParam {String} TypeVehicule  Type of vehicule used.
 * @apiParam {Number} Note  Total votes on this deliver.
 * @apiParam {Number} NbVotes  Number of votes on this deliver.
 * 
 * @apiSuccess {String} message  Delivers created.
 *
 * @apiError DeliverNotCreated The deliver was not created.
 */
router.post('/', function(req, res) 
{
  if (creation(req.body) !== null)
    res.status(201).json({ message: entityName + " created" });
  else 
    res.status(401).json({ message: "DeliverNotCreated" });
});


/**
 * @api {put} /delivers/:id Update Deliver information
 * @apiName PutDeliver
 * @apiGroup Delivers
 *
 * @apiParam {Number} id  Unique id of the deliver.
 * 
 * @apiParam {Number} IdUser  Unique id of the user related to this deliver.
 * @apiParam {String} AdresseFacturation  Adress of facturation.
 * @apiParam {String} TypeVehicule  Type of vehicule used.
 * @apiParam {Number} Note  Total votes on this deliver.
 * @apiParam {Number} NbVotes  Number of votes on this deliver.
 * 
 * @apiSuccess {String} message  Delivers updated.
 *
 * @apiError DeliverNotUpdated The deliver was not updated.
 */
router.put('/:id', function(req, res) 
{
  if (update(req.body, req.params.id) !== null)
    res.status(202).json({ message: entityName + "updated" });
  else 
    res.status(401).json({ message: "DeliverNotUpdated" });
});


/**
 * @api {delete} /delivers/:id Delete Deliver information
 * @apiName DeleteDeliver
 * @apiGroup Delivers
 *
 * @apiParam {Number} id  Unique id of the deliver.
 * 
 * @apiSuccess {String} message  Delivers deleted.
 *
 * @apiError DeliversNotDeleted The deliver was not deleted.
 */
router.delete('/:id', function(req, res)
{
  if (deletion(req.params.id) !== null)
    res.status(203).json({ message: entityName + "deleted" });
  else 
    res.status(401).json({ message: "DeliversNotDeleted" });
});

module.exports = router;