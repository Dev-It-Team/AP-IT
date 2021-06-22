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

async function update(body, idRestaurant)
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
        id: idRestaurant
      }
    });
    return true;
  } catch(error) {
    return null;
  }
}

async function deletion(idRestaurant)
{
  try 
  {
    await Restaurants.destroy({ 
      where: {
        id: idRestaurant
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

async function getOne(idRestaurant)
{
  try 
  {
      return await Restaurants.findAll({ 
        where: {
          id: idRestaurant
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
    res.status(401).json({ message: "Could not get one " + entityName });
});


/* POST */
router.post('/', function(req, res, next) 
{
  if (creation(req.body) !== null)
    res.status(201).json({ message: entityName + "created" });
  else 
    res.status(401).json({ message: "Could not create " + entityName });
});


/* PUT */
router.put('/:id', function(req, res, next) 
{
  if (update(req.body, req.params.id) !== null)
    res.status(202).json({ message: entityName + "updated" });
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