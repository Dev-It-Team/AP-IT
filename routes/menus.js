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

/* GET menus listing. */
router.get('/', function(req, res, next) 
{
    Menu.find({}, function (err, docs) 
    {
      if (err)
        res.status(401).send(err);  
      else
        res.status(200).send(docs);
    });
});

/* GET menus listing by id. */
router.get('/:id', function(req, res, next) 
{
    Menu.find({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).send(err);
      else
        res.status(200).send(docs);
    });
});

/* POST */
router.post('/', function(req, res, next) 
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
        res.status(401).send(err);
      else
        res.status(201).send("menu added");
    });
});

/* PUT */
router.put('/:id', function(req, res, next) 
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
        res.status(401).send(err);
      else
        res.status(202).send("menu updated");
    });
});

/* DELETE */
router.delete('/:id', function(req, res, next)
{
    Menu.deleteOne({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).send(err);
      else
        res.status(203).send(req.params.id + " deleted");
    });
});

module.exports = router;