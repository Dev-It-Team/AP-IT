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
    console.log(entityName + " could not synchronize");
  }
}

async function update(body, idUser)
{
  try 
  {
    return Users.update(body, {
      where: {
        IdUser: idUser
      },
      returning: true,
      plain: true
    });
  } catch(error) {
    return null;
  }
}

async function deletion(idUser)
{
  try 
  {
    await Users.destroy({ 
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
      return await Users.findAll();
  } catch(error) {
    return null;
  }
}

async function getOne(idUser)
{
  try 
  {
      return await Users.findAll({ 
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


/* GET commands listing. */
router.get('/', function(req, res, next) 
{
  getAll().then((users) => {
      return res.status(200).json(users);
  }).catch(() => {
      return res.status(401).json({ message: "Could not get " + entityName });
  });
});


/* GET commands listing by id. */
router.get('/:id', function(req, res, next) 
{
  getOne(req.params.id).then((user) => {
      return res.status(200).json(user);
  }).catch(() => {
      return res.status(401).json({ message: "Could not get " + entityName });
  });
});


/* PUT */
router.put('/:id', function(req, res, next) 
{
  update(req.body, req.params.id).then((user) => {
      return res.status(200).json(user);
  }).catch(() => {
      return res.status(401).json({ message: "Could not update " + entityName });
  });
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