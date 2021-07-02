var express = require('express');
var router = express.Router();
var sequelize = require('../app.js').configDatabase;
const entityName = "DeliveryDrivers";
const { DataTypes } = require('sequelize');

const Users = require('./users/schema_users');
const DeliveryDrivers = sequelize.define(entityName, {
  IdDeliveryDriver: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  IdUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
    foreignKey: 'Users',
    sourceKey: 'IdUser'
  },
  VehiculeType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Note: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  VoteNb: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
}, {
    tableName: entityName,
    createdAt: false,
    updatedAt: false,
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
    console.error(entityName + " could not synchronize");
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
/**
 * @api {get} /deliveryDrivers/ Request Delivery Drivers information
 * @apiVersion 1.1.0
 * @apiName GetDeliveryDrivers
 * @apiGroup DeliveryDrivers
 *
 * @apiSuccess {Number} IdDeliveryDriver  Unique id of the delivery driver.
 * @apiSuccess {Number} IdUser  Unique id of the user related to this delivery driver.
 * @apiSuccess {String} VehiculeType  Type of vehicule used.
 * @apiSuccess {Number} Note  Total votes on this delivery driver.
 * @apiSuccess {Number} VoteNb   Number of votes on this delivery driver.
 *
 * @apiError DeliveryDriversNotAccessible The table is inaccessible due to server fault.
 */
router.get('/', function(req, res) 
{
  DeliveryDrivers.findAll().then((delivers) => {
    return res.status(200).json(delivers);
  }).catch(error => {
    return res.status(500).json({ 
      message: "DeliveryDriversNotAccessible" 
    });
  });
});

/**
 * @api {get} /deliveryDrivers/users/:IdUser Request specific delivery driver information
 * @apiVersion 1.1.0
 * @apiName GetDeliveryDriver
 * @apiGroup DeliveryDrivers
 *
 * @apiParam {Number} IdUser  Unique id of the user related.
 * 
 * @apiSuccess {Number} IdDeliveryDriver  Unique id of the delivery driver.
 * @apiSuccess {Number} IdUser  Unique id of the user related to this delivery driver.
 * @apiSuccess {String} VehiculeType  Type of vehicule used.
 * @apiSuccess {Number} Note  Total votes on this delivery driver.
 * @apiSuccess {Number} VoteNb  Number of votes on this delivery driver.
 *
 * @apiError DeliveryDriverNotFound The delivery driver wanted was not found.
 */
router.get('/:IdUser', function(req, res) 
{
  DeliveryDrivers.findOne({
    where: {
      IdUser: req.params.IdUser
    }
  }).then(function(delivers) {
    return res.status(200).json(delivers);
  }).catch(error => {
    return res.status(401).json({
      message: 'DeliveryDriverNotFound'
    });
  });
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
/**
 * @api {post} /deliveryDrivers/ Create delivery driver information
 * @apiVersion 1.1.0
 * @apiName PostDeliveryDriver
 * @apiGroup DeliveryDrivers
 *
 * @apiParam {Number} IdUser  Unique id of the user related to this delivery driver.
 * @apiParam {String} VehiculeType  Type of vehicule used.
 * 
 * @apiSuccess {String} message  Delivery Driver created.
 *
 * @apiError DeliveryDriverNotCreated The delivery driver was not created.
 * @apiError DuplicateDeliveryDriver The delivery driver is already created.
 * @apiError DatabaseError Database issues.
 */
router.post('/', function(req, res) 
{
  DeliveryDrivers.findOne({
    where: {
      IdUser: req.body.IdUser
    }
  }).then(function(delivers) {
    if (delivers) {
      return res.status(401).json({
        message: 'DuplicateDeliveryDriver'
      });
    }

    DeliveryDrivers.create({
      IdUser: req.body.IdUser,
      VehiculeType: req.body.VehiculeType,
      Note: 0,
      VoteNb: 0
    }).then(response => {
      return res.status(201).json({
        message: 'DeliveryDriver created'
      });
    }).catch(error => {
      return res.status(401).json({
        message: 'DeliveryDriverNotCreated',
        stackTrace: error
      });
    });
  }).catch(error => {
    return res.status(500).json({
      message: 'DatabaseError'
    });
  });
});


/**
 * @api {put} /deliveryDrivers/:id Update delivery driver information
 * @apiVersion 1.1.0
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
/**
 * @api {put} /deliveryDrivers/:id Update delivery driver information
 * @apiVersion 1.1.0
 * @apiName PutDeliveryDriver
 * @apiGroup DeliveryDrivers
 *
 * @apiParam {Number} IdDeliveryDriver  Unique id of the delivery driver.
 * 
 * @apiParam {Number} IdUser  Unique id of the user related to this delivery driver.
 * @apiParam {String} VehiculeType  Type of vehicule used.
 * @apiParam {Number} Note  Total votes on this delivery driver.
 * @apiParam {Number} VoteNb  Number of votes on this delivery driver.
 * 
 * @apiSuccess {String} message  Delivery Drivers updated.
 *
 * @apiError DeliveryDriverNotUpdated The delivery driver was not updated.
 * @apiError DeliveryDriverNotFound The delivery driver does not exists.
 * @apiError DatabaseError Database issues.
 */
router.put('/:IdDeliveryDriver', function(req, res) 
{
  DeliveryDrivers.findOne({
    where: {
      IdDeliveryDriver: req.params.IdDeliveryDriver
    }
  }).then(function(delivers) {
    if (!delivers) {
      return res.status(401).json({
        message: 'DeliveryDriverNotFound'
      });
    }

    DeliveryDrivers.update({
      IdUser: req.body.IdUser,
      VehiculeType: req.body.VehiculeType,
      Note: req.body.Note,
      VoteNb: req.body.VoteNb
    },
    {
      where: {
        IdDeliveryDriver: req.params.IdDeliveryDriver
      }
    }).then(response => {
      return res.status(202).json({
        message: 'DeliveryDriver updated'
      });
    }).catch(error => {
      return res.status(401).json({
        message: 'DeliveryDriverNotUpdated',
        stackTrace: error
      });
    });
  }).catch(error => {
    return res.status(500).json({
      message: 'DatabaseError'
    });
  });
});


/**
 * @api {delete} /deliveryDrivers/:id Delete delivery driver information
 * @apiVersion 1.1.0
 * @apiName DeleteDeliveryDriver
 * @apiGroup DeliveryDrivers
 *
 * @apiParam {Number} id  Unique id of the delivery driver.
 * 
 * @apiSuccess {String} message delivery driver deleted.
 *
 * @apiError DeliveryDriverNotDeleted The delivery driver was not deleted.
 */
/**
 * @api {delete} /deliveryDrivers/:id Delete delivery driver information
 * @apiVersion 1.0.0
 * @apiName DeleteDeliveryDriver
 * @apiGroup DeliveryDrivers
 *
 * @apiParam {Number} IdDeliveryDriver  Unique id of the delivery driver.
 * 
 * @apiSuccess {String} message delivery driver deleted.
 *
 * @apiError DeliveryDriverNotDeleted The delivery driver was not deleted.
 */
router.delete('/:IdDeliveryDriver', function(req, res)
{
  DeliveryDrivers.findOne({
    where: {
      IdDeliveryDriver: req.params.IdDeliveryDriver
    }
  }).then(function(delivers) {
    if (!delivers) {
      return res.status(401).json({
        message: 'DeliveryDriverNotFound'
      });
    }

    DeliveryDrivers.destroy({
      where: {
        IdDeliveryDriver: req.params.IdDeliveryDriver
      }
    }).then(response => {
      return res.status(203).json({
        message: 'DeliveryDriver deleted'
      });
    }).catch(error => {
      return res.status(401).json({
        message: 'DeliveryDriverNotDeleted',
        stackTrace: error
      });
    });
  }).catch(error => {
    return res.status(500).json({
      message: 'DatabaseError'
    });
  });
});

module.exports = router;