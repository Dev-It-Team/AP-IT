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
    res.status(401).json({ message: "Could not get " + entityName });
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
    res.status(202).json({ message: entityName + " updated"});
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