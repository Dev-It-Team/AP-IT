var express = require('express');
var router = express.Router();

/* GET products listing. */
router.get('/', function(req, res, next) 
{
    Product.find({}, function (err, docs) 
    {
      if (err)
        res.send(err);
      else
        res.send(docs);
    });
});

/* GET products listing by id. */
router.get('/:id', function(req, res, next) 
{
    Product.find({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.send(err);
      else
        res.send(docs);
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
        res.send(err);
      else
        res.send("product added");
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
        res.send(err);
      else
        res.send("product updated");
    });
});

/* DELETE */
router.delete('/:id', function(req, res, next)
{
    Product.deleteOne({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.send(err);
      else
        res.send(req.params.id + " deleted");
    });
});

module.exports = router;