var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const { Schema } = mongoose;
const productSchema = new Schema({
    id : Number,
    id_restau: Number,
    name: String,
    description: String,
    pictures: Array,
    sizes: Array,
    notes: Number,
    notes_number: Number
})
const Product = mongoose.model('Product', productSchema);

/* GET products listing. */
router.get('/', function(req, res, next) 
{
    Product.find({}, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "Could not get Products" });
      else
        res.status(200).json(docs);
    });
});

/* GET products listing by id. */
router.get('/:id', function(req, res, next) 
{
    Product.find({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "Could not get one Products" });
      else
        res.status(200).json(docs);
    });
});

/* POST */
router.post('/', function(req, res, next) 
{
    const newProduct = new Product();

    newProduct.id = req.body.id;
    newProduct.id_restau = req.body.id_restau;
    newProduct.name = req.body.name;
    newProduct.description = req.body.description;
    newProduct.pictures = req.body.pictures;
    newProduct.sizes = req.body.sizes;
    newProduct.notes = req.body.notes;
    newProduct.notes_number = req.body.notes_number;

    newProduct.save(function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "Could not create Products" });
      else
        res.status(201).json({ message: "Products added" });
    });
});


/* PUT */
router.put('/:id', function(req, res, next) 
{
    Product.updateOne({ id : req.params.id}, 
    {
      id : req.params.id,
      id_restau : req.body.id_restau,
      name : req.body.name,
      price : req.body.price,
      description : req.body.description,
      pictures : req.body.pictures,
      sizes : req.body.sizes,
      notes : req.body.notes,
      notes_number : req.body.notes_number
    },
    function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "Could not update Products" });
      else
        res.status(202).json({ message: "Products updated" });
    });
});

/* DELETE */
router.delete('/:id', function(req, res, next)
{
    Product.deleteOne({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "Could not delete Products" });
      else
        res.status(203).json({ message: "Products deleted" });
    });
});

module.exports = router;