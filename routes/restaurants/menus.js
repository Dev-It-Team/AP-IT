var express = require('express');
var router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');

const { Schema } = mongoose;
const menuSchema = new Schema({
    IdRestaurant: Number,
    Name: String,
    Description: String,
    Products: Array,
    Picture: Array,
    Price: Number,
    Notes: Number,
    VoteNb: Number
})
const Menu = mongoose.model('Menu', menuSchema);


/**
 * @api {get} /menus/ Recover Menus information
 * @apiVersion 1.0.0
 * @apiName GetMenus
 * @apiGroup Menus
 * 
 * @apiDescription Returns an array of menus.
 * 
 * @apiSuccess {Number} id  Menu's unique id.
 * @apiSuccess {Number} id_restau  Restaurant's id related to this menu.
 * @apiSuccess {String} name  Name of this menu.
 * @apiSuccess {Number} price  Menu's price.
 * @apiSuccess {String} description  Menu's description.
 * @apiSuccess {Array} products  List of products inside this menu.
 * @apiSuccess {Array} pictures List of pictures for this menu.
 * @apiSuccess {Number} notes  Total of every notes on this menu.
 * @apiSuccess {Number} notes_number Number of notes for this menu.
 *
 * @apiError MenusNotAccessible The model is inaccessible due to server fault.
 */
/**
 * @api {get} /restaurants/:IdRestaurant/menus/ Recover Menus information
 * @apiVersion 1.1.0
 * @apiName GetMenus
 * @apiGroup Menus
 * 
 * @apiDescription Returns an array of menus.
 * 
 * @apiSuccess {Number} _id  Menu's unique id.
 * @apiSuccess {Number} IdRestaurant  Restaurant's id related to this menu.
 * @apiSuccess {String} Name  Name of this menu.
 * @apiSuccess {String} Description  Menu's description.
 * @apiSuccess {Array} Products  List of products inside this menu.
 * @apiSuccess {Array} Picture List of pictures for this menu.
 * @apiSuccess {Number} Price  Menu's price.
 * @apiSuccess {Number} Notes  Total of every notes on this menu.
 * @apiSuccess {Number} VoteNb Number of notes for this menu.
 *
 * @apiError MenusNotAccessible The model is inaccessible due to server fault.
 */
router.get('/', function(req, res) 
{
    Menu.find({
      IdRestaurant: req.params.IdRestaurant
    }, function (err, docs) 
    {
      if (err)
        res.status(500).json({ message: "MenusNotAccessible" });  
      else
        res.status(200).json(docs);
    });
});


/**
 * @api {get} /menus/:id Recover specific Menu information
 * @apiVersion 1.0.0
 * @apiName GetMenu
 * @apiGroup Menus
 * 
 * @apiParam {Number} id  Menu's unique id.
 * 
 * @apiSuccess {Number} id  Menu's unique id.
 * @apiSuccess {Number} id_restau  Restaurant's id related to this menu.
 * @apiSuccess {String} name  Name of this menu.
 * @apiSuccess {Number} price  Menu's price.
 * @apiSuccess {String} description  Menu's description.
 * @apiSuccess {Array} products  List of products inside this menu.
 * @apiSuccess {Array} pictures List of pictures for this menu.
 * @apiSuccess {Number} notes  Total of every notes on this menu.
 * @apiSuccess {Number} notes_number Number of notes for this menu.
 *
 * @apiError MenuNotFound The wanted menu was not found.
 */
/**
 * @api {get} /restaurants/:IdRestaurant/menus/:id Recover specific Menu information
 * @apiVersion 1.1.0
 * @apiName GetMenu
 * @apiGroup Menus
 * 
 * @apiParam {Number} IdMenu  Menu's unique id.
 * 
 * @apiSuccess {Number} _id  Menu's unique id.
 * @apiSuccess {Number} IdRestaurant  Restaurant's id related to this menu.
 * @apiSuccess {String} Name  Name of this menu.
 * @apiSuccess {String} Description  Menu's description.
 * @apiSuccess {Array} Products  List of products inside this menu.
 * @apiSuccess {Array} Picture List of pictures for this menu.
 * @apiSuccess {Number} Price  Menu's price.
 * @apiSuccess {Number} Notes  Total of every notes on this menu.
 * @apiSuccess {Number} VoteNb Number of notes for this menu.
 *
 * @apiError MenuNotFound The wanted menu was not found.
 */
router.get('/:IdMenu', function(req, res) 
{
    Menu.findOne({ 
      _id : req.params.IdMenu,
      IdRestaurant: req.params.IdRestaurant
    }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "MenuNotFound" });
      else
        res.status(200).json(docs);
    });
});


/**
 * @api {post} /menus/ Create Menu information
 * @apiVersion 1.0.0
 * @apiName PostMenus
 * @apiGroup Menus
 * 
 * @apiParam {Number} id_restau  Restaurant's id related to this menu.
 * @apiParam {String} name  Name of this menu.
 * @apiParam {Number} price  Menu's price.
 * @apiParam {String} description  Menu's description.
 * @apiParam {Array} products  List of products inside this menu.
 * @apiParam {Array} pictures List of pictures for this menu.
 * @apiParam {Number} notes  Total of every notes on this menu.
 * @apiParam {Number} notes_number Number of notes for this menu.
 * 
 * @apiSuccess {String} message  Menus added.
 *
 * @apiError MenuNotCreated The menu cannot be created.
 */
/**
 * @api {post} /restaurants/:IdRestaurant/menus/ Create Menu information
 * @apiVersion 1.1.0
 * @apiName PostMenus
 * @apiGroup Menus
 * 
 * @apiDescription Create a new menu, please not that you can't create two menus in the same restaurant with the same name.
 * 
 * @apiParam {Number} IdRestaurant  Restaurant's id related to this menu.
 * @apiParam {String} Name  Name of this menu.
 * @apiParam {String} Description  Menu's description.
 * @apiParam {Array} Products  List of products inside this menu.
 * @apiParam {Array} Picture List of pictures for this menu.
 * @apiParam {Number} Price  Menu's price.
 * 
 * @apiSuccess {String} message  Menus added.
 *
 * @apiError MenuNotCreated The menu cannot be created.
 * @apiError DuplicateMenu The menu created already exists.
 * @apiError DatabaseError Database issues.
 */
router.post('/', function(req, res) 
{
  Menu.find({
    where: {
      IdRestaurant: req.params.IdRestaurant,
      Name: req.body.Name
    }
  }).then(function(menu) {
    if (menu) {
      return res.status(403).json({ 
        message: "DuplicateMenu"
      });
    }

    Menu.create({
      IdRestaurant: req.params.IdRestaurant,
      Name: req.body.Name,
      Description: req.body.Description,
      Products: req.body.Products,
      Picture: req.body.Picture,
      Price: req.body.Price,
      Notes: 0,
      VoteNb: 0
    }).then((response) => {
      return res.status(201).json({ message: "Menus added" });
    }).catch((error) => {
      return res.status(401).json({ 
        message: "MenuNotCreated",
        stackTrace: error 
      });
    });
  }).catch((error) => {
    return res.status(500).json({ 
      message: "DatabaseError", 
      stackTrace: error 
    });
  });
});


/**
 * @api {put} /menus/:id Update Menu information
 * @apiVersion 1.0.0
 * @apiName PutMenus
 * @apiGroup Menus
 * 
 * @apiParam {Number} id  Menu's unique id.
 * @apiParam {Number} id_restau  Restaurant's id related to this menu.
 * @apiParam {String} name  Name of this menu.
 * @apiParam {Number} price  Menu's price.
 * @apiParam {String} description  Menu's description.
 * @apiParam {Array} products  List of products inside this menu.
 * @apiParam {Array} pictures List of pictures for this menu.
 * @apiParam {Number} notes  Total of every notes on this menu.
 * @apiParam {Number} notes_number Number of notes for this menu.
 * 
 * @apiSuccess {String} message  Menus updated.
 *
 * @apiError MenuNotUpdated The menu cannot be updated.
 */
/**
 * @api {put} /restaurants/:IdRestaurant/menus/:id Update Menu information
 * @apiVersion 1.1.0
 * @apiName PutMenus
 * @apiGroup Menus
 * 
 * @apiParam {String} IdMenu  Menu's unique id.
 * @apiParam {Number} IdRestaurant  Restaurant's id related to this menu.
 * @apiParam {String} Name  Name of this menu.
 * @apiParam {String} Description  Menu's description.
 * @apiParam {Array} Products  List of products inside this menu.
 * @apiParam {Array} Picture List of pictures for this menu.
 * @apiParam {Number} Price  Menu's price.
 * @apiParam {Number} Notes  Total of every notes on this menu.
 * @apiParam {Number} VoteNb Number of notes for this menu.
 * 
 * @apiSuccess {String} message  Menus updated.
 *
 * @apiError MenuNotUpdated The menu cannot be updated.
 * @apiError MenuNotExisting The menu wanted is not existing.
 * @apiError DatabaseError Database issues.
 */
router.put('/:IdMenu', function(req, res) 
{
  Menu.findById(req.params.IdMenu).then(function(menu) {
    if (!menu) {
      return res.status(403).json({
        message: 'MenuNotExisting'
      })
    }

    Menu.updateOne({ _id : req.params.IdMenu}, 
    {
      IdRestaurant : req.params.IdRestaurant,
      Name : req.body.Name,
      Description : req.body.Description,
      Products : req.body.Products,
      Picture : req.body.Picture,
      Price : req.body.Price,
      Notes : req.body.Notes,
      VoteNb : req.body.VoteNb
    }).then((response) => {
      return res.status(201).json({
        message: 'Menu updated'
      });
    }).catch((error) => {
      return res.status(401).json({
        message: "MenuNotUpdated",
        stackTrace: error
      })
    })}).catch((error) => {
      return res.status(500).json({
        message: "DatabaseError",
        stackTrace: error
      })
    });
});


/**
 * @api {delete} /menus/:id Delete Menu information
 * @apiVersion 1.0.0
 * @apiName DeleteMenus
 * @apiGroup Menus
 * 
 * @apiParam {Number} id  Menu's unique id.
 * 
 * @apiSuccess {String} message  Menus deleted.
 *
 * @apiError MenuNotDeleted The menu cannot be deleted.
 */
/**
 * @api {delete} /restaurants/:IdRestaurant/menus/:id Delete Menu information
 * @apiVersion 1.1.0
 * @apiName DeleteMenus
 * @apiGroup Menus
 * 
 * @apiParam {String} IdMenu  Menu's unique id.
 * 
 * @apiSuccess {String} message  Menus deleted.
 *
 * @apiError MenuNotDeleted The menu cannot be deleted.
 * @apiError MenuNotExisting The menu wanted does not exists.
 * @apiError DatabaseError Database issues.
 */
router.delete('/:IdMenu', function(req, res)
{
  Menu.findById(req.params.IdMenu).then(function(menu) {
    if (!menu) {
      return res.status(403).json({
        message: 'MenuNotExisting'
      })
    }
  
    Menu.deleteOne({ 
      _id : req.params.IdMenu 
    }).then((response) => {
      return res.status(203).json({ message: "Menus deleted" });
    }).catch((error) => {
      return res.status(401).json({
        message: 'MenuNotDeleted',
        stackTrace: error
      })
    })
  }).catch((error) => {
    return res.status(500).json({
      message: 'DatabaseError',
      stackTrace: error
  })});
});

module.exports = router;