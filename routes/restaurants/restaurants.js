var express = require('express');
var router = express.Router();
var sequelize = require('../../app.js').configDatabase;
const entityName = "Restaurants";
const { DataTypes } = require('sequelize');

const Restaurants = sequelize.define(entityName, {
    IdRestaurant: {
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
    NameRestaurant: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Banner: {
        type: DataTypes.STRING,
        allowNull: true
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
    await Restaurants.sync();
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
  Restaurants.findAll().then((restaurants) => {
    return res.status(200).json(restaurants);
  }).catch(error => {
    return res.status(500).json({ 
      message: "RestaurantsNotAccessible" 
    });
  });
});


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
 router.get('/:IdRestaurant', function(req, res) 
 {
   Restaurants.findOne({
     where: {
      IdRestaurant: req.params.IdRestaurant
     }
   }).then(function(restaurant) {
     return res.status(200).json(restaurant);
   }).catch(error => {
     return res.status(401).json({
       message: 'RestaurantNotFound'
     });
   });
 });
 
 router.get('/id/:IdUser', function(req, res) 
 {
   Restaurants.findOne({
     where: {
      IdUser: req.params.IdUser
     }
   }).then(function(restaurant) {
     return res.status(200).json(restaurant);
   }).catch(error => {
     return res.status(401).json({
       message: 'RestaurantNotFound'
     });
   });
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
 * @apiParam {Number} IdUser  User's id related to this restaurant.
 * @apiParam {String} NameRestaurant  Name of this restaurant.
 * @apiParam {String} Banner  Pictures of the restaurant.
 * 
 * @apiSuccess {String} message  Restaurants created.
 *
 * @apiError RestaurantNotCreated The restaurant was not created.
 * @apiError DuplicateRestaurant Restaurant already created.
 * @apiError DatabaseError Database issues.
 */
router.post('/', function(req, res) 
{
  Restaurants.findOne({
    where: {
      IdUser: req.body.IdUser
    }
  }).then(function(restaurant) {
    if (restaurant) {
      return res.status(403).json({
        message: 'DuplicateRestaurant'
      });
    }

    Restaurants.create({
      IdUser: req.body.IdUser,
      NameRestaurant: req.body.NameRestaurant,
      Banner: req.body.Banner
    }).then(response => {
      return res.status(201).json({
        message: 'Restaurants created'
      });
    }).catch(error => {
      return res.status(401).json({
        message: 'RestaurantNotCreated',
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
 * @apiParam {String} NameRestaurant  Name of this restaurant.
 * @apiParam {String} Banner  Pictures of the restaurant.
 * 
 * @apiSuccess {String} message  Restaurants updated.
 *
 * @apiError RestaurantNotUpdated The restaurant was not updated.
 * @apiError RestaurantNotFound The restaurant was not found.
 * @apiError DatabaseError Database issues.
 */
router.put('/:IdRestaurant', function(req, res) 
{
  Restaurants.findOne({
    where: {
      IdRestaurant: req.params.IdRestaurant
    }
  }).then(function(restaurant) {
    if (!restaurant) {
      return res.status(403).json({
        message: 'RestaurantNotFound'
      });
    }

    Restaurants.update({
      NameRestaurant: req.body.NameRestaurant,
      Banner: req.body.Banner
    },
    {
      where: {
        IdRestaurant: req.params.IdRestaurant
      }
    }).then(response => {
      return res.status(202).json({
        message: 'Restaurants updated'
      });
    }).catch(error => {
      return res.status(401).json({
        message: 'RestaurantNotUpdated',
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
 * @apiError RestaurantNotFound The restaurant was not found.
 * @apiError DatabaseError Database issues.
 */
router.delete('/:IdRestaurant', function(req, res)
{
  Restaurants.findOne({
    where: {
      IdRestaurant: req.params.IdRestaurant
    }
  }).then(function(restaurant) {
    if (!restaurant) {
      return res.status(403).json({
        message: 'RestaurantNotFound'
      });
    }

    Restaurants.destroy({
      where: {
        IdRestaurant: req.params.IdRestaurant
      }
    }).then(response => {
      return res.status(203).json({
        message: 'Restaurants deleted'
      });
    }).catch(error => {
      return res.status(401).json({
        message: 'RestaurantNotDeleted',
        stackTrace: error
      });
    });
  }).catch(error => {
    return res.status(500).json({
      message: 'DatabaseError'
    });
  });
});

const productsRouter = require('./products');
const menusRouter = require('./menus');
router.use('/:IdRestaurant/products', productsRouter);
router.use('/:IdRestaurant/menus', menusRouter);

module.exports = router;