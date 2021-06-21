var express = require('express');
var router = express.Router();
var config = require('../app.js').configDatabase;
var sql = require('mssql');


/* GET download logs listing. */
router.get('/', function(req, res, next) 
{
  var dbConn = new sql.ConnectionPool(config);
  
  dbConn.connect().then(function () 
  {
      var request = new sql.Request(dbConn);
  
      request.query("SELECT * FROM DownloadLogs").then(function (recordSet)
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


/* GET download logs listing by id. */
router.get('/:id', function(req, res, next) 
{
  var dbConn = new sql.ConnectionPool(config);
  
  dbConn.connect().then(function () 
  {
      var request = new sql.Request(dbConn);
  
      request.query("SELECT * FROM DownloadLogs WHERE id = " + req.params.id).then(function (recordSet) 
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
  const dataString = "(" + req.body.datetime + ", " + req.body.component + ")";

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
  const dataString = "datetime = " + req.body.datetime + ", component =" + req.body.component;

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
  
      request.query("DELETE FROM DownLoadLogs WHERE id = " + req.params.id).then(function (recordSet)
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