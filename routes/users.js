var express = require('express');
var router = express.Router();
const {checkTokenMiddleware, extractBearerToken} = require('../jwtMiddleware');
const jwt = require('jsonwebtoken');
var sequelize = require('../app.js').configDatabase;
const { DataTypes } = require('sequelize');
const entityName = "Utilisateurs";
const users = [
    { IdUser: 1, username: 'admin', password: 'password123' }
]

const Utilisateurs = sequelize.define(entityName, {
  IdUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  Nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Adresse: {
    type: DataTypes.STRING,
    allowNull: false
  },
  MotDePasse: {
    type: DataTypes.STRING,
    allowNull: false
  },
  DateDeNaissance: {
    type: DataTypes.DATE,
    allowNull: false
  },
  DateInscription: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  UserFlag: {
    type: DataTypes.STRING,
    allowNull: false
  },
  CodeParainage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  NbParainages: {
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
    await Utilisateurs.sync();
  } catch(error) {
    console.log(entityName + " could not synchronize");
  }
}

async function creation(body)
{
  try 
  {
    await Utilisateurs.create({
      Nom: body.Nom,
      Prenom: body.Prenom,
      Email: body.Email,
      Adresse: body.Adresse,
      MotDePasse: body.MotDePasse,
      DateDeNaissance: body.DateDeNaissance,
      DateInscription: body.DateInscription,
      UserFlag: body.UserFlag,
      CodeParainage: body.CodeParainage,
      NbParainages: body.NbParainages,
    });
    return true;
  } catch(error) {
    return null;
  }
}

async function update(body, idUser)
{
  try 
  {
    await Utilisateurs.update({
      Nom: body.Nom,
      Prenom: body.Prenom,
      Email: body.Email,
      Adresse: body.Adresse,
      MotDePasse: body.MotDePasse,
      DateDeNaissance: body.DateDeNaissance,
      DateInscription: body.DateInscription,
      UserFlag: body.UserFlag,
      CodeParainage: body.CodeParainage,
      NbParainages: body.NbParainages,
    }, {
      where: {
        IdUser: idUser
      }
    });
    return true;
  } catch(error) {
    return null;
  }
}

async function deletion(idUser)
{
  try 
  {
    await Utilisateurs.destroy({ 
      where: {
        IdUser: idUser
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
      return await Utilisateurs.findAll();
  } catch(error) {
    return null;
  }
}

async function getOne(idUser)
{
  try 
  {
      return await Utilisateurs.findAll({ 
        where: {
          IdUser: idUser
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

router.post('/login', (req, res) => {
  // Missing password or username
  if (!req.body.username || !req.body.password) {
      return res.status(400).json({
          message: 'Error. Please enter the correct username and password'
      });
  }

  // Checking
  const user = users.find(u => u.username === req.body.username && u.password === req.body.password);

  // Unknown user
  if (!user) {
      return res.status(400).json({
          message: 'Error. Wrong login or password'
      });
  }

  const token = jwt.sign({
      IdUser: user.IdUser,
      username: user.username
  }, process.env.TOKEN_SECRET, { expiresIn: '3 hours' });

  return res.json({ access_token: token });
});

router.get('/tokeninfo', checkTokenMiddleware, (req, res) => {
  // Fetch token
  const token = req.headers.authorization && extractBearerToken(req.headers.authorization);
  // Decode token
  const decoded = jwt.decode(token, { complete: false });

  return res.json({ content: decoded });
});

router.post('/register', (req, res) => {
  // Missing password or username
  if (!req.body.username || !req.body.password) {
      return res.status(400).json({ message: 'Error. Please enter username and password' });
  }

  const userExists = users.find(u => u.username === req.body.username);
  if (userExists) {
      return res.status(400).json({ message: `Error. User ${req.body.username} already exists` });
  }

  // Insert new user
  const IdUser = users[users.length - 1].IdUser + 1
  const newUser = {
      IdUser: IdUser,
      username: req.body.username,
      password: req.body.password
  }
  users.push(newUser);

  return res.status(201).json({ message: `User ${IdUser} created` });
});


/**
 * @api {get} /users/ Recover Users information
 * @apiVersion 1.0
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
router.get('/', function(req, res) 
{
  const allDocs = getAll();

  if (allDocs !== null)
    res.status(200).json(allDocs);
  else 
    res.status(500).json({ message: "UsersNotAccessible" });
});


/**
 * @api {get} /users/ Recover specific Users information
 * @apiVersion 1.0
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
router.get('/:id', function(req, res) 
{
  const doc = getOne(req.params.id);

  if (doc !== null)
    res.status(200).json(doc);
  else 
    res.status(401).json({ message: "UserNotFound " + entityName });
});



/**
 * @api {post} /users/ Create Users information
 * @apiVersion 1.0
 * @apiName PostUser
 * @apiGroup Users
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
 * @apiSuccess {String} message  Users created.
 *
 * @apiError UserNotCreated The user cannot be created.
 */
router.post('/', function(req, res) 
{
  if (creation(req.body) !== null)
    res.status(201).json({ message: entityName + " created" });
  else 
    res.status(401).json({ message: "UserNotCreated" });
});


/**
 * @api {put} /users/ Update Users information
 * @apiVersion 1.0
 * @apiName PutUser
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
router.put('/:id', function(req, res) 
{
  if (update(req.body, req.params.id) !== null)
    res.status(202).json({ message: entityName + " updated"});
  else 
    res.status(401).json({ message: "UserNotUpdated" });
});


/**
 * @api {delete} /users/ Delete Users information
 * @apiVersion 1.0
 * @apiName DeleteUser
 * @apiGroup Users
 * 
 * @apiParam {Number} IdUser  Unique id of the user.
 * 
 * @apiSuccess {String} message  Users deleted.
 *
 * @apiError UserNotDeleted The user cannot be deleted.
 */
router.delete('/:id', function(req, res)
{
  if (deletion(req.params.id) !== null)
    res.status(203).json({ message: entityName + " deleted" });
  else 
    res.status(401).json({ message: "UserNotDeleted" });
});

module.exports = router;