var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const { Schema } = mongoose;
const menuSchema = new Schema({
    id : Number,
    id_restau: Number,
    name: String,
    price: Number,
    description: String,
    products: Array,
    pictures: Array,
    notes: Number,
    notes_number: Number
})
const Menu = mongoose.model('Menu', menuSchema);


/**
 * @api {get} /menus/ Recover Menus information
 * @apiVersion 1.0
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
 * @apiVersion 1.0
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
router.get('/:id', function(req, res) 
{
    Menu.find({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "MenuNotFound" });
      else
        res.status(200).json(docs);
    });
});


/**
 * @api {post} /menus/ Create Menu information
 * @apiVersion 1.0
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
router.post('/', function(req, res) 
{
    const newMenu = new Menu();

    newMenu.id = req.body.id;
    newMenu.id_restau = req.body.id_restau;
    newMenu.name = req.body.name;
    newMenu.price = req.body.price;
    newMenu.description = req.body.description;
    newMenu.products = req.body.products;
    newMenu.pictures = req.body.pictures;
    newMenu.notes = req.body.notes;
    newMenu.notes_number = req.body.notes_number;

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
 * @apiVersion 1.0
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
router.put('/:id', function(req, res) 
{
    Menu.updateOne({ id : req.params.id}, 
    {
      id : req.params.id,
      id_restau : req.body.id_restau,
      name : req.body.name,
      price : req.body.price,
      description : req.body.description,
      products : req.body.products,
      pictures : req.body.pictures,
      notes : req.body.notes,
      notes_number : req.body.notes_number
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
 * @apiVersion 1.0
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
    Menu.deleteOne({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "MenuNotDeleted" });
      else
        res.status(203).json({ message: "Menus deleted" });
    });
});

module.exports = router;