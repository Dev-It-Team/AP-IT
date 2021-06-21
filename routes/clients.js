var express = require('express');
var router = express.Router();
var config = require('../app.js').configDatabase;
var sql = require('mssql');

const tableName = "Clients";

/* GET commands listing. */
router.get('/', function(req, res, next) 
{
  var dbConn = new sql.ConnectionPool(config);
  
  dbConn.connect().then(function () 
  {
      var request = new sql.Request(dbConn);
  
      request.query("SELECT * FROM " + tableName).then(function (recordSet)
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
  
      request.query("SELECT * FROM " + tableName + " WHERE id = " + req.params.id).then(function (recordSet) 
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
  const dataString = "(" + req.body.id_user + ", " + req.body.adresse_facturation + ", " + req.body.code_parainage + ", " + req.body.nb_parainages + ")";

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
  const dataString = "id_user = " + req.body.id_user + ", adresse_facturation =" + req.body.adresse_facturation + ", code_parainage = " + req.body.code_parainage + ", nb_parainages = " + req.body.nb_parainages;

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
  
      request.query("DELETE FROM " + tableName + " WHERE id = " + req.params.id).then(function (recordSet)
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