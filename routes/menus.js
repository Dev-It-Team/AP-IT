var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const { Schema } = mongoose;
const menuSchema = new Schema({
    IdMenu : Number,
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
 * @api {get} /menus/ Recover Menus information
 * @apiVersion 1.1.0
 * @apiName GetMenus
 * @apiGroup Menus
 * 
 * @apiSuccess {Number} IdMenu  Menu's unique id.
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
    Menu.find({}, function (err, docs) 
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
 * @api {get} /menus/:id Recover specific Menu information
 * @apiVersion 1.1.0
 * @apiName GetMenu
 * @apiGroup Menus
 * 
 * @apiParam {Number} id  Menu's unique id.
 * 
 * @apiSuccess {Number} IdMenu  Menu's unique id.
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
router.get('/:id', function(req, res) 
{
    Menu.find({ IdMenu : req.params.id }, function (err, docs) 
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
 * @api {post} /menus/ Create Menu information
 * @apiVersion 1.1.0
 * @apiName PostMenus
 * @apiGroup Menus
 * 
 * @apiParam {Number} IdRestaurant  Restaurant's id related to this menu.
 * @apiParam {String} Name  Name of this menu.
 * @apiParam {String} Description  Menu's description.
 * @apiParam {Array} Products  List of products inside this menu.
 * @apiParam {Array} Picture List of pictures for this menu.
 * @apiParam {Number} Price  Menu's price.
 * @apiParam {Number} Notes  Total of every notes on this menu.
 * @apiParam {Number} VoteNb Number of notes for this menu.
 * 
 * @apiSuccess {String} message  Menus added.
 *
 * @apiError MenuNotCreated The menu cannot be created.
 */
router.post('/', function(req, res) 
{
    const newMenu = new Menu();

    newMenu.IdRestaurant = req.body.IdRestaurant;
    newMenu.Name = req.body.Name;
    newMenu.Description = req.body.Description;
    newMenu.Products = req.body.Products;
    newMenu.Picture = req.body.Picture;
    newMenu.Price = req.body.Price;
    newMenu.Notes = req.body.Notes;
    newMenu.VoteNb = req.body.VoteNb;

    newMenu.save(function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "MenuNotCreated" });
      else
        res.status(201).json({ message: "Menus added" });
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
 * @api {put} /menus/:id Update Menu information
 * @apiVersion 1.1.0
 * @apiName PutMenus
 * @apiGroup Menus
 * 
 * @apiParam {Number} id  Menu's unique id.
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
 */
router.put('/:id', function(req, res) 
{
    Menu.updateOne({ IdMenu : req.params.id}, 
    {
      IdRestaurant : req.body.IdRestaurant,
      Name : req.body.Name,
      Description : req.body.Description,
      Products : req.body.Products,
      Picture : req.body.Picture,
      Price : req.body.Price,
      Notes : req.body.Notes,
      VoteNb : req.body.VoteNb
    },
    function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "MenuNotUpdated" });
      else
        res.status(202).json({ message: "Menus updated" });
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
 * @api {delete} /menus/:id Delete Menu information
 * @apiVersion 1.1.0
 * @apiName DeleteMenus
 * @apiGroup Menus
 * 
 * @apiParam {Number} id  Menu's unique id.
 * 
 * @apiSuccess {String} message  Menus deleted.
 *
 * @apiError MenuNotDeleted The menu cannot be deleted.
 */
router.delete('/:id', function(req, res)
{
    Menu.deleteOne({ IdMenu : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "MenuNotDeleted" });
      else
        res.status(203).json({ message: "Menus deleted" });
    });
});

module.exports = router;