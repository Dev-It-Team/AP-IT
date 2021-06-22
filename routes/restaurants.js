var express = require('express');
var router = express.Router();
var sequelize = require('../app.js').configDatabase;
const entityName = "Restaurants";
const { DataTypes } = require('sequelize');

const Restaurants = sequelize.define(entityName, {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  restaurant_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  restaurant_adresse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_banniere: {
    type: DataTypes.STRING,
    allowNull: true
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
    await Restaurants.sync();
  } catch(error) {
    console.log(entityName + " could not synchronize");
  }
}

async function creation(body)
{
  try 
  {
    await Restaurants.create({
      id_user: body.id_user,
      restaurant_name: body.restaurant_name,
      restaurant_adresse: body.restaurant_adresse,
      image_banniere: body.image_banniere,
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
    await Restaurants.update({
      id_user: body.id_user,
      restaurant_name: body.restaurant_name,
      restaurant_adresse: body.restaurant_adresse,
      image_banniere: body.image_banniere,
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
    await Restaurants.destroy({ 
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
      return await Restaurants.findAll();
  } catch(error) {
    return null;
  }
}

async function getOne(idLog)
{
  try 
  {
      return await Restaurants.findAll({ 
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