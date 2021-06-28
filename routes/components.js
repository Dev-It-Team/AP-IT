var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const { Schema } = mongoose;
const componentScheam = new Schema({
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
 * @apiSuccess {String} IdComponent id of the component.
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
    Components.find(function (err, docs) 
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
 * @apiParam {String} id Component unique ID.
 *
 * @apiSuccess {String} IdComponent id of the component.
 * @apiSuccess {String} Name  Name of the component.
 * @apiSuccess {String} Description Description of the component.
 * @apiSuccess {String} Link  Link of the component.
 * @apiSuccess {Array} Files  Files inside this component.
 *
 * @apiError ComponentNotFound The component was not found.
 */
router.get('/:IdComponent', function(req, res) 
{
    Components.findById(req.params.IdComponent, function (err, docs) 
    {
      if (err)
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
 * @apiSuccess {String} message  Component created.
 *
 * @apiError ComponentNotCreated The component cannot be created.
 * @apiError DuplicateComponent Already existinc component.
 * @apiError DatabaseError Database issues.
 */
router.post('/', function(req, res) 
{
  Components.findOne({
    where: {
      Name: req.body.Name
    }
  }).then(function(component) {
    if (component) {
      return res.status(403).json({
        message: 'DuplicateComponent'
      });
    }

    Components.create({
      Name: req.body.Name,
      Description: req.body.Description,
      Link: req.body.Link,
      Files: req.body.Files
    }).then((response) => {
      return res.status(201).json({
        message: 'Component created'
      });
    }).catch((error) => {
      return res.status(401).json({
        message: 'ComponentNotCreated',
        stackTrace: error
      });
    });
  }).catch((error) => {
    return res.status(500).json({
      message: 'DatabaseError',
      stackTrace: error
    })
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
 * @apiParam {String} IdComponent id of the component.
 * 
 * @apiParam {String} Name  Name of the component.
 * @apiParam {String} Description Description of the component.
 * @apiParam {String} Link  Link of the component.
 * @apiParam {Array} Files  Files inside this component.
 * 
 * @apiSuccess {String} message  Components updated.
 *
 * @apiError ComponentNotUpdated The component cannot be updated.
 * @apiError ComponentNotExisting The component does not exists.
 * @apiError DatabaseError Database issues.
 */
router.put('/:IdComponent', function(req, res) 
{
  Components.findById(req.params.IdComponent).then(function(component) {
    if (!component) {
      return res.status(403).json({
        message: 'ComponentNotExisting'
      });
    }

    Components.updateOne({ _id : req.params.IdComponent}, 
    {
      Name : req.body.Name,
      Description : req.body.Description,
      Link : req.body.Link,
      Files : req.body.Files
    }).then((response) => {
      return res.status(201).json({
        message: 'Component updated'
      });
    }).catch((error) => {
      return res.status(401).json({
        message: 'ComponentNotUpdated',
        stackTrace: error
      });
    });
  }).catch((error) => {
    return res.status(500).json({
      message: 'DatabaseError',
      stackTrace: error
    });
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
 * @apiParam {String} IdComponent id of the component.
 * 
 * @apiSuccess {String} message  Components deleted.
 *
 * @apiError ComponentNotDeleted The component cannot be deleted.
 * @apiError ComponentNotExisting The component does not exists.
 * @apiError DatabaseError Database issues.
 */
router.delete('/:IdComponent', function(req, res)
{
  Components.findById(req.params.IdComponent).then(component => {
    if (!component) {
      return res.status(403).json({
        message: 'ComponentNotExisting'
      });
    }

    Components.deleteOne({ _id : req.params.IdComponent }).then((response) => {
      return res.status(201).json({
        message: 'Component deleted'
      });
    }).catch((error) => {
      return res.status(401).json({
        message: 'ComponentNotDeleted',
        stackTrace: error
      });
    });
  }).catch(error => {
    return res.status(500).json({
      message: 'DatabaseError',
      stackTrace: error
    });
  });
});

const logsDownloadRouter = require('./logsDownload');
router.use('/:IdComponent/logs', logsDownloadRouter);

module.exports = router;
