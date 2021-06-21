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
  const dataString = "(" + req.body.id_user + ", " + req.body.adresse_recu + ", " + req.body.type_vehicule + ", " + req.body.notes + ", " + req.body.nb_notes + ")";

    var dbConn = new sql.ConnectionPool(config);
    
    dbConn.connect().then(function () 
    {
        var request = new sql.Request(dbConn);
    
        request.query("INSERT INTO " + tableName + dataString).then(function (recordSet) 
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


/* PUT */
router.put('/:id', function(req, res, next) 
{
  const dataString = "id_user = " + req.body.id_user + ", adresse_recu =" + req.body.adresse_recu + ", type_vehicule = " + req.body.type_vehicule + ", notes = " + req.body.notes+ ", nb_notes = " + req.body.nb_notes;

    var dbConn = new sql.ConnectionPool(config);
    
    dbConn.connect().then(function () 
    {
        var request = new sql.Request(dbConn);
    
        request.query("UPDATE " + tableName + " SET " + dataString + "WHERE id = " + req.params.id).then(function (recordSet) 
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

/* DELETE */
router.delete('/:id', function(req, res, next)
{
  var dbConn = new sql.ConnectionPool(config);
  
  dbConn.connect().then(function () 
  {
      var request = new sql.Request(dbConn);
  
      request.query("DELETE FROM Delivers WHERE id = " + req.params.id).then(function (recordSet)
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

module.exports = router;