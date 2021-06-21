var express = require('express');
var router = express.Router();
var config = require('../app.js').configDatabase;
var sql = require('mssql');


/* GET connection logs listing. */
router.get('/', function(req, res, next) 
{
  var dbConn = new sql.ConnectionPool(config);
  
  dbConn.connect().then(function () 
  {
      var request = new sql.Request(dbConn);
  
      request.query("SELECT * FROM ConnectionLogs").then(function (recordSet)
      {
        res.send(recordSet);
        dbConn.close();
      }).catch(function (err) 
      {
        res.send(err);
        dbConn.close();
      });
  }).catch(function (err) 
  {
    res.send(err);
  });
});


/* GET commands listing by id. */
router.get('/:id', function(req, res, next) 
{
  var dbConn = new sql.ConnectionPool(config);
  
  dbConn.connect().then(function () 
  {
      var request = new sql.Request(dbConn);
  
      request.query("SELECT * FROM ConnectionLogs WHERE id = " + req.params.id).then(function (recordSet) 
      {
        res.send(recordSet);
        dbConn.close();
      }).catch(function (err) 
      {
        res.send(err);
        dbConn.close();
      });
  }).catch(function (err) 
  {
    res.send(err);
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