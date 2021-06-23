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

/**
 * @api {get} /components Request Components information
 * @apiVersion 1.0
 * @apiName GetComponents
 * @apiGroup Component
 *
 * @apiSuccess {Number} id id of the component.
 * @apiSuccess {String} name  Name of the component.
 * @apiSuccess {String} description Description of the component.
 * @apiSuccess {String} link  Link of the component.
 * @apiSuccess {Array} files  Files inside this component.
 *
 * @apiError ComponentNotAccessible The model is inaccessible due to server fault.
 * 
 */
router.get('/', function(req, res) 
{
    Component.find({}, function (err, docs) 
    {
      if (err || docs.length == 0)
        res.status(500).json({ message: "ComponentNotAccessible" });
      else
        res.status(200).json(docs);
    });
});


/**
 * @api {get} /components/:id Request specific Component information
 * @apiVersion 1.0
 * @apiName GetComponent
 * @apiGroup Component
 *
 * @apiParam {Number} id Component unique ID.
 *
 * @apiSuccess {Number} id id of the component.
 * @apiSuccess {String} name  Name of the component.
 * @apiSuccess {String} description Description of the component.
 * @apiSuccess {String} link  Link of the component.
 * @apiSuccess {Array} files  Files inside this component.
 *
 * @apiError ComponentNotFound The component was not found.
 */
router.get('/:id', function(req, res) 
{
    Component.find({ id : req.params.id }, function (err, docs) 
    {
      if (err || docs.length == 0)
        res.status(401).json({ message: "ComponentNotFound" });
      else
        res.status(200).json(docs);
    });
});


/**
 * @api {post} /components/ Create a new Component
 * @apiVersion 1.0
 * @apiName PostComponent
 * @apiGroup Component
 *
 * @apiParam {String} name  Name of the component.
 * @apiParam {String} description Description of the component.
 * @apiParam {String} link  Link of the component.
 * @apiParam {Array} files  Files inside this component.
 * 
 * @apiSuccess {String} message  Components created.
 *
 * @apiError ComponentNotCreated The component cannot be created.
 */
router.post('/', function(req, res) 
{
    const newComponent = new Component();

    newComponent.name = req.body.name;
    newComponent.description = req.body.description;
    newComponent.link = req.body.link;
    newComponent.files = req.body.files;

    newComponent.save(function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "ComponentNotCreated" });
      else
        res.status(201).json({ message: "Components created" });
    });
});


/**
 * @api {put} /components/:id Update a Component
 * @apiVersion 1.0
 * @apiName PutComponent
 * @apiGroup Component
 *
 * @apiParam {Number} id id of the component.
 * 
 * @apiParam {String} name  Name of the component.
 * @apiParam {String} description Description of the component.
 * @apiParam {String} link  Link of the component.
 * @apiParam {Array} files  Files inside this component.
 * 
 * @apiSuccess {String} message  Components updated.
 *
 * @apiError ComponentNotUpdated The component cannot be updated.
 */
router.put('/:id', function(req, res) 
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
        res.status(401).json({ message: "ComponentNotUpdated" });
      else
        res.status(202).json({ message: "Components updated" });
    });
});


/**
 * @api {deleted} /components/:id Delete a Component
 * @apiVersion 1.0
 * @apiName DeletedComponent
 * @apiGroup Component
 *
 * @apiParam {Number} id id of the component.
 * 
 * @apiSuccess {String} message  Components deleted.
 *
 * @apiError ComponentNotDeleted The component cannot be deleted.
 */
router.delete('/:id', function(req, res)
{
    Component.deleteOne({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "ComponentNotDeleted" });
      else
        res.status(203).json({ message: "Components deleted" });
    });
});

module.exports = router;