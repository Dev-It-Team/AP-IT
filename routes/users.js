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
  const dataString = "(" + req.body.nom + ", " + req.body.prenom + ", " + req.body.email + ", " + req.body.adresse + ", " + req.body.age + ", " + req.body.date_inscription  + ", " + req.body.user_flag + ")";

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
  const dataString = "nom = " + req.body.nom + ", prenom =" + req.body.prenom + "email = " + req.body.email + ", adresse =" + req.body.adresse + "age = " + req.body.age + ", date_inscription =" + req.body.date_inscription + "user_flag = " + req.body.user_flag;

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
  
      request.query("DELETE FROM Users WHERE id = " + req.params.id).then(function (recordSet)
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