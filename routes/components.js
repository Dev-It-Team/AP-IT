var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const { Schema } = mongoose;
const componentScheam = new Schema({
    id : Number,
    name: String,
    description: String,
    link: String,
    files: Array
})
const Component = mongoose.model('Component', componentScheam);

/* GET components listing. */
router.get('/', function(req, res, next) 
{
    Component.find({}, function (err, docs) 
    {
      if (err)
        res.send(err);
      else
        res.send(docs);
    });
});

/* GET components listing by id. */
router.get('/:id', function(req, res, next) 
{
    Component.find({ id : req.params.id }, function (err, docs) 
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
      id : req.body.id,
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