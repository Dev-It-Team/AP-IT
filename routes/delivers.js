var express = require('express');
var router = express.Router();
var config = require('../app.js').configDatabase;
var sql = require('mssql');


/* GET delivers listing. */
router.get('/', function(req, res, next) 
{
  var dbConn = new sql.ConnectionPool(config);
  
  dbConn.connect().then(function () 
  {
      var request = new sql.Request(dbConn);
  
      request.query("SELECT * FROM Delivers").then(function (recordSet)
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


/* GET delivers listing by id. */
router.get('/:id', function(req, res, next) 
{
  var dbConn = new sql.ConnectionPool(config);
  
  dbConn.connect().then(function () 
  {
      var request = new sql.Request(dbConn);
  
      request.query("SELECT * FROM Delivers WHERE id = " + req.params.id).then(function (recordSet) 
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
        res.send(err);
      else
        res.send("menu added");
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
        res.send(err);
      else
        res.send("menu updated");
    });
});

/* DELETE */
router.delete('/:id', function(req, res, next)
{
    Menu.deleteOne({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.send(err);
      else
        res.send(req.params.id + " deleted");
    });
});

module.exports = router;