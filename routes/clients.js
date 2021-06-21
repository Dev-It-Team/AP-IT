var express = require('express');
var router = express.Router();

/* GET commands listing. */
router.get('/', function(req, res, next) 
{
    Command.find({}, function (err, docs) 
    {
      if (err)
        res.send(err);
      else
        res.send(docs);
    });
});

/* GET commands listing by id. */
router.get('/:id', function(req, res, next) 
{
    Command.find({ id : req.params.id }, function (err, docs) 
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
    const newCommand = new Command();

    newCommand.id = req.body.id;
    newCommand.id_restau = req.body.id_restau;
    newCommand.id_user = req.body.id_user;
    newCommand.id_deliver = req.body.id_deliver;
    newCommand.start_datetime = req.body.start_datetime;
    newCommand.end_datetime = req.body.end_datetime;
    newCommand.price = req.body.price;
    newCommand.products = req.body.products;
    newCommand.status = req.body.status;

    newCommand.save(function (err, docs) 
    {
      if (err)
        res.send(err);
      else
        res.send("command added");
    });
});

/* PUT */
router.put('/:id', function(req, res, next) 
{
    Command.updateOne({ id : req.params.id}, 
    {
      id : req.params.id,
      id_restau : req.body.id_restau,
      id_user : req.body.id_user,
      id_deliver : req.body.id_deliver,
      start_datetime : req.body.start_datetime,
      end_datetime : req.body.end_datetime,
      price : req.body.price,
      products : req.body.products,
      status : req.body.status
    },
    function (err, docs) 
    {
      if (err)
        res.send(err);
      else
        res.send("command updated");
    });
});

/* DELETE */
router.delete('/:id', function(req, res, next)
{
    Command.deleteOne({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.send(err);
      else
        res.send(req.params.id + " deleted");
    });
});

module.exports = router;