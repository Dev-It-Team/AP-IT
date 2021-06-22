var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const { Schema } = mongoose;
const commandSchema = new Schema({
    id : Number,
    id_restau: Number,
    id_user: Number,
    id_deliveryDriver: Number,
    start_datetime: String,
    end_datetime: String,
    price: Number,
    products: Array,
    status: String
})
const Command = mongoose.model('Command', commandSchema);


/**
 * @api {get} /commands/ Request Commands information
 * @apiName GetCommands
 * @apiGroup Commands
 *
 * @apiSuccess {Number} id  Unique id of the command.
 * @apiSuccess {Number} id_restau  Unique id of the restaurant related to this command.
 * @apiSuccess {Number} id_user  Unique id of the user related to this command.
 * @apiSuccess {Number} id_deliveryDriver  Unique id of the delivery driver related to this command.
 * @apiSuccess {Date} start_datetime  Start date time of the command.
 * @apiSuccess {Date} end_datetime  End date time of the command.
 * @apiSuccess {Number} price  Price of the command.
 * @apiSuccess {Array} products List of products inside this command.
 * @apiSuccess {String} status  Current command status.
 *
 * @apiError CommandsNotAccessible The model is inaccessible due to server fault.
 */
router.get('/', function(req, res, next) 
{
    Command.find({}, function (err, docs) 
    {
      if (err || docs.length == 0)
        res.status(500).json({ message: "CommandsNotAccessible" });
      else
        res.status(200).json(docs);
    });
});


/**
 * @api {get} /commands/:id Request specific Command information
 * @apiName GetCommands
 * @apiGroup Commands
 *
 * @apiParam {Number} id  Unique id of the command.
 * 
 * @apiSuccess {Number} id  Unique id of the command.
 * @apiSuccess {Number} id_restau  Unique id of the restaurant related to this command.
 * @apiSuccess {Number} id_user  Unique id of the user related to this command.
 * @apiSuccess {Number} id_deliveryDriver  Unique id of the delivery driver related to this command.
 * @apiSuccess {Date} start_datetime  Start date time of the command.
 * @apiSuccess {Date} end_datetime  End date time of the command.
 * @apiSuccess {Number} price  Price of the command.
 * @apiSuccess {Array} products List of products inside this command.
 * @apiSuccess {String} status  Current command status.
 *
 * @apiError CommandNotFound The command was not found.
 */
router.get('/:id', function(req, res, next) 
{
    Command.find({ id : req.params.id }, function (err, docs) 
    {
      if (err || docs.length == 0)
        res.status(401).json({ message: "CommandNotFound" });
      else
        res.status(200).json(docs);
    });
});


/**
 * @api {post} /commands/ Create Command information
 * @apiName PostCommands
 * @apiGroup Commands
 *
 * @apiParam {Number} id_restau  Unique id of the restaurant related to this command.
 * @apiParam {Number} id_user  Unique id of the user related to this command.
 * @apiParam {Number} id_deliveryDriver  Unique id of the delivery driver related to this command.
 * @apiParam {Date} start_datetime  Start date time of the command.
 * @apiParam {Date} end_datetime  End date time of the command.
 * @apiParam {Number} price  Price of the command.
 * @apiParam {Array} products List of products inside this command.
 * @apiParam {String} status  Current command status.
 * 
 * @apiSuccess {String} message  Command created.
 *
 * @apiError CommandsNotCreated The command can not be created.
 */
router.post('/', function(req, res, next) 
{
    const newCommand = new Command();

    newCommand.id = req.body.id;
    newCommand.id_restau = req.body.id_restau;
    newCommand.id_user = req.body.id_user;
    newCommand.id_deliveryDriver = req.body.id_deliveryDriver;
    newCommand.start_datetime = req.body.start_datetime;
    newCommand.end_datetime = req.body.end_datetime;
    newCommand.price = req.body.price;
    newCommand.products = req.body.products;
    newCommand.status = req.body.status;

    newCommand.save(function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "CommandsNotCreated" });
      else
        res.status(201).json({ message: "Commands created" });
    });
});


/**
 * @api {put} /commands/:id Update Command information
 * @apiName PutCommands
 * @apiGroup Commands
 *
 * @apiParam {Number} id  Unique id of the command.
 * @apiParam {Number} id_restau  Unique id of the restaurant related to this command.
 * @apiParam {Number} id_user  Unique id of the user related to this command.
 * @apiParam {Number} id_deliveryDriver  Unique id of the delivery driver related to this command.
 * @apiParam {Date} start_datetime  Start date time of the command.
 * @apiParam {Date} end_datetime  End date time of the command.
 * @apiParam {Number} price  Price of the command.
 * @apiParam {Array} products List of products inside this command.
 * @apiParam {String} status  Current command status.
 * 
 * @apiSuccess {String} message  Command updated.
 *
 * @apiError CommandsNotUpdated The command can not be updated.
 */
router.put('/:id', function(req, res, next) 
{
    Command.updateOne({ id : req.params.id}, 
    {
      id : req.params.id,
      id_restau : req.body.id_restau,
      id_user : req.body.id_user,
      id_deliveryDriver : req.body.id_deliveryDriver,
      start_datetime : req.body.start_datetime,
      end_datetime : req.body.end_datetime,
      price : req.body.price,
      products : req.body.products,
      status : req.body.status
    },
    function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "CommandsNotUpdated" });
      else
        res.status(202).json({ message: "Commands updated" });
    });
});


/**
 * @api {delete} /commands/:id Delete Command information
 * @apiName DeleteCommands
 * @apiGroup Commands
 *
 * @apiParam {Number} id  Unique id of the command.
 * 
 * @apiSuccess {String} message  Command deleted.
 *
 * @apiError CommandsNotDeleted The command can not be deleted.
 */
router.delete('/:id', function(req, res, next)
{
    Command.deleteOne({ id : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "CommandsNotDeleted" });
      else
        res.status(203).json({ message: "Commands deleted" });
    });
});

module.exports = router;