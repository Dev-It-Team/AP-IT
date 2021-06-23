var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) 
{
  res.status(200).json({ message: "Visit our doc for more information: https://dev-it-team.github.io/AP-IT-Doc/index.html"});
});

module.exports = router;