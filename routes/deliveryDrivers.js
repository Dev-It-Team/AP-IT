var express = require('express');
var router = express.Router();
var sequelize = require('../app.js').configDatabase;
const entityName = "DeliveryDrivers";
const { DataTypes } = require('sequelize');

const DeliveryDrivers = sequelize.define(entityName, {
  IdDeliveryDriver: {
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
    await DeliveryDrivers.sync();
  } catch(error) {
    console.log(entityName + " could not synchronize");
  }
}

async function creation(body)
{
  try 
  {
    await DeliveryDrivers.create({
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

async function update(body, idDeliveryDriver)
{
  try 
  {
    await DeliveryDrivers.update({
      idUser: body.idUser,
      AdresseFacturation: body.AdresseFacturation,
      TypeVehicule: body.TypeVehicule,
      Note: body.Note,
      NbVotes: body.NbVotes,
    }, {
      where: {
        IdDeliveryDriver: idDeliveryDriver
      }
    });
    return true;
  } catch(error) {
    return null;
  }
}

async function deletion(idDeliveryDriver)
{
  try 
  {
    await DeliveryDrivers.destroy({ 
      where: {
        IdDeliveryDriver: idDeliveryDriver
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
      return await DeliveryDrivers.findAll();
  } catch(error) {
    return null;
  }
}

async function getOne(idDeliveryDriver)
{
  try 
  {
      return await DeliveryDrivers.findAll({ 
        where: {
          IdDeliveryDriver: idDeliveryDriver
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
 * @api {get} /deliveryDrivers/ Request Delivery Drivers information
 * @apiVersion 1.0.0
 * @apiName GetDeliveryDrivers
 * @apiGroup DeliveryDrivers
 *
 * @apiSuccess {Number} IdDeliveryDriver  Unique id of the delivery driver.
 * @apiSuccess {Number} IdUser  Unique id of the user related to this delivery driver.
 * @apiSuccess {String} AdresseFacturation  Adress of facturation.
 * @apiSuccess {String} TypeVehicule  Type of vehicule used.
 * @apiSuccess {Number} Note  Total votes on this delivery driver.
 * @apiSuccess {Number} NbVotes  Number of votes on this delivery driver.
 *
 * @apiError DeliveryDriversNotAccessible The table is inaccessible due to server fault.
 */
router.get('/', function(req, res) 
{
  const allDocs = getAll();

  if (allDocs !== null || allDocs.length == 0)
    res.status(200).json(allDocs);
  else 
    res.status(500).json({ message: "DeliveryDriversNotAccessible" });
});


/**
 * @api {get} /deliveryDrivers/:id Request specific delivery driver information
 * @apiVersion 1.0.0
 * @apiName GetDeliveryDriver
 * @apiGroup DeliveryDrivers
 *
 * @apiParam {Number} IdDeliveryDriver  Unique id of the delivery driver.
 * 
 * @apiSuccess {Number} IdDeliveryDriver  Unique id of the delivery driver.
 * @apiSuccess {Number} IdUser  Unique id of the user related to this delivery driver.
 * @apiSuccess {String} AdresseFacturation  Adress of facturation.
 * @apiSuccess {String} TypeVehicule  Type of vehicule used.
 * @apiSuccess {Number} Note  Total votes on this delivery driver.
 * @apiSuccess {Number} NbVotes  Number of votes on this delivery driver.
 *
 * @apiError DeliveryDriverNotFound The delivery driver wanted was not found.
 */
router.get('/:id', function(req, res) 
{
  const doc = getOne(req.params.id);

  if (doc !== null || doc.length == 0)
    res.status(200).json(doc);
  else 
    res.status(401).json({ message: "DeliveryDriverNotFound" });
});


/**
 * @api {post} /deliveryDrivers/ Create delivery driver information
 * @apiVersion 1.0.0
 * @apiName PostDeliveryDriver
 * @apiGroup DeliveryDrivers
 *
 * @apiParam {Number} IdUser  Unique id of the user related to this delivery driver.
 * @apiParam {String} AdresseFacturation  Adress of facturation.
 * @apiParam {String} TypeVehicule  Type of vehicule used.
 * @apiParam {Number} Note  Total votes on this delivery driver.
 * @apiParam {Number} NbVotes  Number of votes on this delivery driver.
 * 
 * @apiSuccess {String} message  Delivery Driver created.
 *
 * @apiError DeliveryDriverNotCreated The delivery driver was not created.
 */
router.post('/', function(req, res) 
{
  if (creation(req.body) !== null)
    res.status(201).json({ message: entityName + " created" });
  else 
    res.status(401).json({ message: "DeliveryDriverNotCreated" });
});


/**
 * @api {put} /deliveryDrivers/:id Update delivery driver information
 * @apiVersion 1.0.0
 * @apiName PutDeliveryDriver
 * @apiGroup DeliveryDrivers
 *
 * @apiParam {Number} id  Unique id of the delivery driver.
 * 
 * @apiParam {Number} IdUser  Unique id of the user related to this delivery driver.
 * @apiParam {String} AdresseFacturation  Adress of facturation.
 * @apiParam {String} TypeVehicule  Type of vehicule used.
 * @apiParam {Number} Note  Total votes on this delivery driver.
 * @apiParam {Number} NbVotes  Number of votes on this delivery driver.
 * 
 * @apiSuccess {String} message  Delivery Drivers updated.
 *
 * @apiError DeliveryDriverNotUpdated The delivery driver was not updated.
 */
router.put('/:id', function(req, res) 
{
  if (update(req.body, req.params.id) !== null)
    res.status(202).json({ message: entityName + "updated" });
  else 
    res.status(401).json({ message: "DeliveryDriverNotUpdated" });
});


/**
 * @api {delete} /deliveryDrivers/:id Delete delivery driver information
 * @apiVersion 1.0.0
 * @apiName DeleteDeliveryDriver
 * @apiGroup DeliveryDrivers
 *
 * @apiParam {Number} id  Unique id of the delivery driver.
 * 
 * @apiSuccess {String} message delivery driver deleted.
 *
 * @apiError DeliveryDriverNotDeleted The delivery driver was not deleted.
 */
router.delete('/:id', function(req, res)
{
  if (deletion(req.params.id) !== null)
    res.status(203).json({ message: entityName + "deleted" });
  else 
    res.status(401).json({ message: "DeliveryDriverNotDeleted" });
});

module.exports = router;