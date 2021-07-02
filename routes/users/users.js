var express = require('express');
var router = express.Router();
var sequelize = require('../../app.js').configDatabase;
const entityName = "Users";

const Users = require('./schema_users');

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
    await Users.sync();
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
 * @api {get} /users/ Recover Users information
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiSuccess {Number} IdUser  Unique id of the user.
 * @apiSuccess {String} Nom User's name.
 * @apiSuccess {String} Prenom  User's firstname.
 * @apiSuccess {String} Email  Email of the user.
 * @apiSuccess {String} MotDePasse User's password.
 * @apiSuccess {Date} DateDeNaissance  Birthdate of the user.
 * @apiSuccess {String} Adresse  User's address.
 * @apiSuccess {Date} DateInscription Date when the user create its account.
 * @apiSuccess {String} CodeParainage  Unique code that permits the user to patron someone.
 * @apiSuccess {Number} NbParainages Number of patronage.
 * @apiSuccess {String} UserFlag  Type of user.
 *
 * @apiError UsersNotAccessible The table is inaccessible due to server fault.
 */
/**
 * @api {get} /users/ Recover Users information
 * @apiVersion 1.1.0
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiSuccess {Number} IdUser  Unique id of the user.
 * @apiSuccess {String} Name User's name.
 * @apiSuccess {String} FirstName  User's firstname.
 * @apiSuccess {String} Email  Email of the user.
 * @apiSuccess {String} Password User's password.
 * @apiSuccess {Date} BirthDate  Birthdate of the user.
 * @apiSuccess {String} Address  User's address.
 * @apiSuccess {Date} InscriptionDate Date when the user create its account.
 * @apiSuccess {String} PatronageCode  Unique code that permits the user to patron someone.
 * @apiSuccess {Number} PatronageNb Number of patronage.
 * @apiSuccess {String} UserFlag  Type of user.
 *
 * @apiError UsersNotAccessible The table is inaccessible due to server fault.
 */
router.get('/', function(req, res) 
{
  Users.findAll().then((users) => {
    return res.status(200).json(users);
  }).catch(error => {
    return res.status(500).json({ 
      message: "UsersNotAccessible",
      stackTrace: error 
    });
  });
});


/**
 * @api {get} /users/ Recover specific Users information
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiParam {Number} id  User's unique id.
 * 
 * @apiSuccess {Number} IdUser  Unique id of the user.
 * @apiSuccess {String} Nom User's name.
 * @apiSuccess {String} Prenom  User's firstname.
 * @apiSuccess {String} Email  Email of the user.
 * @apiSuccess {String} MotDePasse User's password.
 * @apiSuccess {Date} DateDeNaissance  Birthdate of the user.
 * @apiSuccess {String} Adresse  User's address.
 * @apiSuccess {Date} DateInscription Date when the user create its account.
 * @apiSuccess {String} CodeParainage  Unique code that permits the user to patron someone.
 * @apiSuccess {Number} NbParainages Number of patronage.
 * @apiSuccess {String} UserFlag  Type of user.
 *
 * @apiError UserNotFound The wanted user was not found.
 */
/**
 * @api {get} /users/ Recover specific Users information
 * @apiVersion 1.1.0
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiParam {Number} IdUser  User's unique id.
 * 
 * @apiSuccess {Number} IdUser  Unique id of the user.
 * @apiSuccess {String} Name User's name.
 * @apiSuccess {String} FirstName  User's firstname.
 * @apiSuccess {String} Email  Email of the user.
 * @apiSuccess {String} Password User's password.
 * @apiSuccess {Date} BirthDate  Birthdate of the user.
 * @apiSuccess {String} Address  User's address.
 * @apiSuccess {Date} InscriptionDate Date when the user create its account.
 * @apiSuccess {String} PatronageCode  Unique code that permits the user to patron someone.
 * @apiSuccess {Number} PatronageNb Number of patronage.
 * @apiSuccess {String} UserFlag  Type of user.
 *
 * @apiError UserNotFound The wanted user was not found.
 */
router.get('/:IdUser', function(req, res) 
{
  Users.findOne({
    where: {
      IdUser: req.params.IdUser
    }
  }).then(function(user) {
      return res.status(200).json(user);
  }).catch(error => {
    return res.status(401).json({ 
      message: "Could not get " + entityName,
      stackTrace: error 
    });
  });
});


/**
 * @api {put} /users/ Update Users information
 * @apiVersion 1.0.0
 * @apiName PutUsers
 * @apiGroup Users
 * 
 * @apiParam {Number} IdUser  Unique id of the user.
 * 
 * @apiParam {String} Nom User's name.
 * @apiParam {String} Prenom  User's firstname.
 * @apiParam {String} Email  Email of the user.
 * @apiParam {String} MotDePasse User's password.
 * @apiParam {Date} DateDeNaissance  Birthdate of the user.
 * @apiParam {String} Adresse  User's address.
 * @apiParam {Date} DateInscription Date when the user create its account.
 * @apiParam {String} CodeParainage  Unique code that permits the user to patron someone.
 * @apiParam {Number} NbParainages Number of patronage.
 * @apiParam {String} UserFlag  Type of user.
 * 
 * @apiSuccess {String} message  Users updated.
 *
 * @apiError UserNotUpdated The user cannot be updated.
 */
/**
 * @api {put} /users/:IdUser Update Users information
 * @apiVersion 1.1.0
 * @apiName PutUsers
 * @apiGroup Users
 * 
 * @apiParam {Number} IdUser  Unique id of the user.
 * 
 * @apiParam {String} Name User's name.
 * @apiParam {String} FirstName  User's firstname.
 * @apiParam {String} Email  Email of the user.
 * @apiParam {String} Password User's password.
 * @apiParam {Date} BirthDate  Birthdate of the user.
 * @apiParam {String} Address  User's address.
 * @apiParam {Date} InscriptionDate Date when the user create its account.
 * @apiParam {String} PatronageCode  Unique code that permits the user to patron someone.
 * @apiParam {Number} PatronageNb Number of patronage.
 * @apiParam {String} UserFlag  Type of user.
 * 
 * @apiSuccess {String} message  Users updated.
 *
 * @apiError UserNotUpdated The user cannot be updated.
 * @apiError UserNotExisting The user does not exists.
 * @apiError DatabaseError Database issues.
 */
router.put('/:IdUser', function(req, res) 
{
  Users.findOne({
    where: {
      IdUser: req.params.IdUser
    }
  }).then(function(user) {
    if (!user) {
      return res.status(403).json({
        message: 'UserNotExisting'
      });
    }

    Users.update({
      Name: req.body.Name,
      FirstName: req.body.FirstName,
      Email: req.body.Email,
      Password: req.body.Password,
      Address: req.body.Address,
      BirthDate: req.body.BirthDate,
      PatronageNb: req.body.PatronageNb
    },
    {
      where: {
        IdUser: req.params.IdUser
      }
    }).then(response => {
      return res.status(202).json({
        message: 'User updated'
      });
    }).catch(error => {
      return res.status(401).json({
        message: 'UserNotUpdated',
        stackTrace: error
      });
    });
  }).catch(error => {
    return res.status(500).json({
      message: 'DatabaseError',
      stackTrace: error
    });
  });
});


/**
 * @api {delete} /users/ Delete Users information
 * @apiVersion 1.0.0
 * @apiName DeleteUsers
 * @apiGroup Users
 * 
 * @apiParam {Number} IdUser  Unique id of the user.
 * 
 * @apiSuccess {String} message  Users deleted.
 *
 * @apiError UserNotDeleted The user cannot be deleted.
 */
/**
 * @api {delete} /users/:IdUser Delete Users information
 * @apiVersion 1.1.0
 * @apiName DeleteUsers
 * @apiGroup Users
 * 
 * @apiParam {Number} IdUser  Unique id of the user.
 * 
 * @apiSuccess {String} message  Users deleted.
 *
 * @apiError UserNotDeleted The user cannot be deleted.
 * @apiError UserNotExisting The user does not exists.
 * @apiError DatabaseError Database issues.
 */
router.delete('/:IdUser', function(req, res)
{
  Users.findOne({
    where: {
      IdUser: req.params.IdUser
    }
  }).then(function(user) {
    if (!user) {
      return res.status(403).json({
        message: 'UserNotExisting'
      });
    }

    Users.destroy({
      where: {
        IdUser: req.params.IdUser
      }
    }).then(response => {
      return res.status(203).json({
        message: 'User deleted'
      });
    }).catch(error => {
      return res.status(401).json({
        message: 'UserNotDeleted',
        stackTrace: error
      });
    });
  }).catch(error => {
    return res.status(500).json({
      message: 'DatabaseError',
      stackTrace: error
    });
  });
});


const logsConnectionRouter = require('../logsConnection');
const ordersRouter = require('./orders');
router.use('/:IdUser/logs', logsConnectionRouter);
router.use('/:IdUser/orders', ordersRouter);

module.exports = router;