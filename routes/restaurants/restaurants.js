var express = require('express');
var router = express.Router();
var sequelize = require('../../app.js').configDatabase;
const entityName = "Restaurants";
const { DataTypes } = require('sequelize');

const Restaurants = sequelize.define(entityName, {
  IdRestaurant: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  IdUser: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  NameRestaurant: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Banner: {
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
    console.error(entityName + " could not synchronize");
  }
}

async function creation(body)
{
  try 
  {
    await Restaurants.create({
      IdUser: body.IdUser,
      Name: body.Name,
      Banner: body.Banner,
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
      IdUser: body.IdUser,
      Name: body.Name,
      Banner: body.Banner,
    }, {
      where: {
        IdRestaurant: idRestaurant
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
        IdRestaurant: idRestaurant
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
          IdRestaurant: idRestaurant
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
 * @api {get} /restaurants/ Get Restaurants Information
 * @apiVersion 1.0.0
 * @apiName GetRestaurants
 * @apiGroup Restaurants
 * 
 * @apiSuccess {Number} IdRestaurant  Restaurant's unique id.
 * @apiSuccess {Number} idUser  User's id related to this restaurant.
 * @apiSuccess {String} Nom  Name of this restaurant.
 * @apiSuccess {String} AdresseRestaurant  Address of this restaurant.
 * @apiSuccess {String} image_banniere  Pictures of the restaurant.
 *
 * @apiError RestaurantsNotAccessible The table is inaccessible due to server fault.
 */
/**
 * @api {get} /restaurants/ Get Restaurants Information
 * @apiVersion 1.1.0
 * @apiName GetRestaurants
 * @apiGroup Restaurants
 * 
 * @apiSuccess {Number} IdRestaurant  Restaurant's unique id.
 * @apiSuccess {Number} IdUser  User's id related to this restaurant.
 * @apiSuccess {String} NameRestaurant  Name of this restaurant.
 * @apiSuccess {String} Banner  Pictures of the restaurant.
 *
 * @apiError RestaurantsNotAccessible The table is inaccessible due to server fault.
 */
router.get('/', function(req, res) 
{
  const allDocs = getAll();

  if (allDocs !== null)
    res.status(200).json(allDocs);
  else 
    res.status(500).json({ message: "RestaurantsNotAccessible" });
});


/**
 * @api {get} /restaurants/:id Get specific Restaurant Information
 * @apiVersion 1.0.0
 * @apiName GetRestaurant
 * @apiGroup Restaurants
 * 
 * @apiParam {Number} IdRestaurant  Restaurant's unique id.
 * 
 * @apiSuccess {Number} IdRestaurant  Restaurant's unique id.
 * @apiSuccess {Number} idUser  User's id related to this restaurant.
 * @apiSuccess {String} Nom  Name of this restaurant.
 * @apiSuccess {String} AdresseRestaurant  Address of this restaurant.
 * @apiSuccess {String} image_banniere  Pictures of the restaurant.
 *
 * @apiError RestaurantNotFound The wanted restaurant cannot be found.
 */
/**
 * @api {get} /restaurants/:id Get specific Restaurant Information
 * @apiVersion 1.1.0
 * @apiName GetRestaurant
 * @apiGroup Restaurants
 * 
 * @apiParam {Number} IdRestaurant  Restaurant's unique id.
 * 
 * @apiSuccess {Number} IdRestaurant  Restaurant's unique id.
 * @apiSuccess {Number} IdUser  User's id related to this restaurant.
 * @apiSuccess {String} NameRestaurant  Name of this restaurant.
 * @apiSuccess {String} Banner  Pictures of the restaurant.
 *
 * @apiError RestaurantNotFound The wanted restaurant cannot be found.
 */
router.get('/:id', function(req, res) 
{
  const doc = getOne(req.params.id);

  if (doc !== null)
    res.status(200).json(doc);
  else 
    res.status(401).json({ message: "RestaurantNotFound" });
});


/**
 * @api {post} /restaurants/ Create Restaurant Information
 * @apiVersion 1.0.0
 * @apiName PostRestaurants
 * @apiGroup Restaurants
 * 
 * @apiParam {Number} IdRestaurant  Restaurant's unique id.
 * @apiParam {Number} idUser  User's id related to this restaurant.
 * @apiParam {String} Nom  Name of this restaurant.
 * @apiParam {String} AdresseRestaurant  Address of this restaurant.
 * @apiParam {String} image_banniere  Pictures of the restaurant.
 * 
 * @apiSuccess {String} message  Restaurants created.
 *
 * @apiError RestaurantNotCreated The restaurant was not created.
 */
/**
 * @api {post} /restaurants/ Create Restaurant Information
 * @apiVersion 1.1.0
 * @apiName PostRestaurants
 * @apiGroup Restaurants
 * 
 * @apiParam {Number} IdRestaurant  Restaurant's unique id.
 * @apiParam {Number} IdUser  User's id related to this restaurant.
 * @apiParam {String} NameRestaurant  Name of this restaurant.
 * @apiParam {String} Banner  Pictures of the restaurant.
 * 
 * @apiSuccess {String} message  Restaurants created.
 *
 * @apiError RestaurantNotCreated The restaurant was not created.
 */
router.post('/', function(req, res) 
{
  if (creation(req.body) !== null)
    res.status(201).json({ message: entityName + "created" });
  else 
    res.status(401).json({ message: "RestaurantNotCreated" });
});


/**
 * @api {put} /restaurants/:id Update Restaurant Information
 * @apiVersion 1.0.0
 * @apiName PutRestaurants
 * @apiGroup Restaurants
 * 
 * @apiParam {Number} IdRestaurant  Restaurant's unique id.
 * 
 * @apiParam {Number} idUser  User's id related to this restaurant.
 * @apiParam {String} Nom  Name of this restaurant.
 * @apiParam {String} AdresseRestaurant  Address of this restaurant.
 * @apiParam {String} image_banniere  Pictures of the restaurant.
 * 
 * @apiSuccess {String} message  Restaurants updated.
 *
 * @apiError RestaurantNotUpdated The restaurant was not updated.
 */
/**
 * @api {put} /restaurants/:id Update Restaurant Information
 * @apiVersion 1.1.0
 * @apiName PutRestaurants
 * @apiGroup Restaurants
 * 
 * @apiParam {Number} IdRestaurant  Restaurant's unique id.
 * 
 * @apiParam {Number} IdUser  User's id related to this restaurant.
 * @apiParam {String} NameRestaurant  Name of this restaurant.
 * @apiParam {String} Banner  Pictures of the restaurant.
 * 
 * @apiSuccess {String} message  Restaurants updated.
 *
 * @apiError RestaurantNotUpdated The restaurant was not updated.
 */
router.put('/:id', function(req, res) 
{
  if (update(req.body, req.params.id) !== null)
    res.status(202).json({ message: entityName + "updated" });
  else 
    res.status(401).json({ message: "RestaurantNotUpdated" });
});


/**
 * @api {delete} /restaurants/:id Delete Restaurant Information
 * @apiVersion 1.0.0
 * @apiName DeleteRestaurants
 * @apiGroup Restaurants
 * 
 * @apiParam {Number} IdRestaurant  Restaurant's unique id.
 * 
 * @apiSuccess {String} message  Restaurants deleted.
 *
 * @apiError RestaurantNotDeleted The restaurant was not deleted.
 */
/**
 * @api {delete} /restaurants/:id Delete Restaurant Information
 * @apiVersion 1.1.0
 * @apiName DeleteRestaurants
 * @apiGroup Restaurants
 * 
 * @apiParam {Number} IdRestaurant  Restaurant's unique id.
 * 
 * @apiSuccess {String} message  Restaurants deleted.
 *
 * @apiError RestaurantNotDeleted The restaurant was not deleted.
 */
router.delete('/:id', function(req, res)
{
  if (deletion(req.params.id) !== null)
    res.status(203).json({ message: entityName + " deleted" });
  else 
    res.status(401).json({ message: "RestaurantNotDeleted" });
});

const productsRouter = require('./products');
const menusRouter = require('./menus');
router.use('/:restauId/products', productsRouter);
router.use('/:restauId/menus', menusRouter);

module.exports = router;