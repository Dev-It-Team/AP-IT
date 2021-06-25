var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const { Schema } = mongoose;
const componentScheam = new Schema({
    IdComponent : Number,
    Name: String,
    Description: String,
    Link: String,
    Files: Array
})
const Components = mongoose.model('Components', componentScheam);

/**
 * @api {get} /components Request Components information
 * @apiVersion 1.0.0
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
/**
 * @api {get} /components Request Components information
 * @apiVersion 1.1.0
 * @apiName GetComponents
 * @apiGroup Component
 *
 * @apiSuccess {Number} IdComponent id of the component.
 * @apiSuccess {String} Name  Name of the component.
 * @apiSuccess {String} Description Description of the component.
 * @apiSuccess {String} Link  Link of the component.
 * @apiSuccess {Array} Files  Files inside this component.
 *
 * @apiError ComponentNotAccessible The model is inaccessible due to server fault.
 * 
 */
router.get('/', function(req, res) 
{
    Components.find({}, function (err, docs) 
    {
      if (err)
        res.status(500).json({ message: "ComponentNotAccessible" });
      else
        res.status(200).json(docs);
    });
});


/**
 * @api {get} /components/:id Request specific Component information
 * @apiVersion 1.0.0
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
/**
 * @api {get} /components/:id Request specific Component information
 * @apiVersion 1.1.0
 * @apiName GetComponent
 * @apiGroup Component
 *
 * @apiParam {Number} id Component unique ID.
 *
 * @apiSuccess {Number} IdComponent id of the component.
 * @apiSuccess {String} Name  Name of the component.
 * @apiSuccess {String} Description Description of the component.
 * @apiSuccess {String} Link  Link of the component.
 * @apiSuccess {Array} Files  Files inside this component.
 *
 * @apiError ComponentNotFound The component was not found.
 */
router.get('/:id', function(req, res) 
{
    Components.find({ IdComponent : req.params.id }, function (err, docs) 
    {
      if (err || docs.length == 0)
        res.status(401).json({ message: "ComponentNotFound" });
      else
        res.status(200).json(docs);
    });
});


/**
 * @api {post} /components/ Create a new Component
 * @apiVersion 1.0.0
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
/**
 * @api {post} /components/ Create a new Component
 * @apiVersion 1.1.0
 * @apiName PostComponent
 * @apiGroup Component
 *
 * @apiParam {String} Name  Name of the component.
 * @apiParam {String} Description Description of the component.
 * @apiParam {String} Link  Link of the component.
 * @apiParam {Array} Files  Files inside this component.
 * 
 * @apiSuccess {String} message  Components created.
 *
 * @apiError ComponentNotCreated The component cannot be created.
 */
router.post('/', function(req, res) 
{
    const newComponent = new Components();

    newComponent.Name = req.body.Name;
    newComponent.Description = req.body.Description;
    newComponent.Link = req.body.Link;
    newComponent.Files = req.body.Files;

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
 * @apiVersion 1.0.0
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
/**
 * @api {put} /components/:id Update a Component
 * @apiVersion 1.1.0
 * @apiName PutComponent
 * @apiGroup Component
 *
 * @apiParam {Number} id id of the component.
 * 
 * @apiParam {String} Name  Name of the component.
 * @apiParam {String} Description Description of the component.
 * @apiParam {String} Link  Link of the component.
 * @apiParam {Array} Files  Files inside this component.
 * 
 * @apiSuccess {String} message  Components updated.
 *
 * @apiError ComponentNotUpdated The component cannot be updated.
 */
router.put('/:id', function(req, res) 
{
    Components.updateOne({ IdComponent : req.params.id}, 
    {
      Name : req.body.Name,
      Description : req.body.Description,
      Link : req.body.Link,
      Files : req.body.Files
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
 * @apiVersion 1.0.0
 * @apiName DeletedComponent
 * @apiGroup Component
 *
 * @apiParam {Number} id id of the component.
 * 
 * @apiSuccess {String} message  Components deleted.
 *
 * @apiError ComponentNotDeleted The component cannot be deleted.
 */
/**
 * @api {deleted} /components/:id Delete a Component
 * @apiVersion 1.1.0
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
    Components.deleteOne({ IdComponent : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "ComponentNotDeleted" });
      else
        res.status(203).json({ message: "Components deleted" });
    });
});

const logsDownloadRouter = require('./logsDownload');
router.use('/:componentId/logs', logsDownloadRouter);

module.exports = router;
