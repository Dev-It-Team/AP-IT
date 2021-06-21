var express = require('express');
var router = express.Router();
var config = require('../app.js').configDatabase;
var sql = require('mssql');


/* GET users listing. */
router.get('/', function(req, res, next) 
{
  var dbConn = new sql.ConnectionPool(config);
  
  dbConn.connect().then(function () 
  {
      var request = new sql.Request(dbConn);
  
      request.query("SELECT * FROM Users").then(function (recordSet)
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


/* GET users listing by id. */
router.get('/:id', function(req, res, next) 
{
  var dbConn = new sql.ConnectionPool(config);
  
  dbConn.connect().then(function () 
  {
      var request = new sql.Request(dbConn);
  
      request.query("SELECT * FROM Users WHERE id = " + req.params.id).then(function (recordSet) 
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
    const newComponent = new Component();

    newComponent.id = req.body.id;
    newComponent.name = req.body.name;
    newComponent.link = req.body.link;
    newComponent.files = req.body.files;

    newComponent.save(function (err, docs) 
    {
      if (err)
        res.send(err);
      else
        res.send("component added");
    });
});

/* PUT */
router.put('/:id', function(req, res, next) 
{
    Component.updateOne({ id : req.params.id}, 
    {
      id : req.params.id,
      name : req.body.name,
      link : req.body.link,
      files : req.body.files
    },
    function (err, docs) 
    {
      if (err)
        res.send(err);
      else
        res.send("component updated");
    });
});

/* DELETE */
router.delete('/:id', function(req, res, next)
{
    Component.deleteOne({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.send(err);
      else
        res.send(req.params.id + " deleted");
    });
});

module.exports = router;