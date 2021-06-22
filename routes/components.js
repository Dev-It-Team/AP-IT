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
        res.status(401).json({ message: "Could not get Components" });
      else
        res.status(200).json(docs);
    });
});

/* GET components listing by id. */
router.get('/:id', function(req, res, next) 
{
    Component.find({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "Could not get one Components" });
      else
        res.status(200).json(docs);
    });
});

/* POST */
router.post('/', function(req, res, next) 
{
    const newComponent = new Component();

    newComponent.name = req.body.name;
    newComponent.description = req.body.description;
    newComponent.link = req.body.link;
    newComponent.files = req.body.files;

    newComponent.save(function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "Could not create Components" });
      else
        res.status(201).json({ message: "Components created" });
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
        res.status(401).json({ message: "Could not update Components" });
      else
        res.status(202).json({ message: "Components updated" });
    });
});

/* DELETE */
router.delete('/:id', function(req, res, next)
{
    Component.deleteOne({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "Could not delete Components" });
      else
        res.status(203).json({ message: "Components deleted" });
    });
});

module.exports = router;