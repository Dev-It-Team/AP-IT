var express = require('express');
var router = express.Router();
const {checkTokenMiddleware, extractBearerToken} = require('../jwtMiddleware');
const jwt = require('jsonwebtoken');
var sequelize = require('../app.js').configDatabase;
const { DataTypes } = require('sequelize');
const entityName = "Users";
const users = [
    { id: 1, username: 'admin', password: 'password123' }
]

const ConnectionLogs = sequelize.define(entityName, {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date_inscription: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  user_flag: {
    type: DataTypes.STRING,
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
      name: body.name,
      firstName: body.firstName,
      email: body.email,
      adresse: body.adresse,
      age: body.age,
      date_inscription: body.date_inscription,
      user_flag: body.user_flag,
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
      name: body.name,
      firstName: body.firstName,
      email: body.email,
      adresse: body.adresse,
      age: body.age,
      date_inscription: body.date_inscription,
      user_flag: body.user_flag,
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
      id: user.id,
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
  const id = users[users.length - 1].id + 1
  const newUser = {
      id: id,
      username: req.body.username,
      password: req.body.password
  }
  users.push(newUser);

  return res.status(201).json({ message: `User ${id} created` });
});


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