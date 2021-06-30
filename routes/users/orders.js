var express = require('express');
var router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');

const { Schema } = mongoose;
const orderSchema = new Schema({
    IdRestaurant: Number,
    IdUser: Number,
    IdDeliveryDriver: Number,
    StartDateTime: String,
    EndDateTime: String,
    Price: Number,
    Products: Array,
    Status: String,
    CouponUsed: Boolean,
})
const Orders = mongoose.model('Orders', orderSchema);


/**
 * @api {get} /commands/ Request Commands information
 * @apiVersion 1.0.0
 * @apiName GetCommands
 * @apiGroup Commands
 *
 * @apiSuccess {Number} id  Unique id of the order.
 * @apiSuccess {Number} id_restau  Unique id of the restaurant related to this order.
 * @apiSuccess {Number} id_user  Unique id of the user related to this order.
 * @apiSuccess {Number} id_deliver  Unique id of the delivery driver related to this order.
 * @apiSuccess {Date} start_datetime  Start date time of the order.
 * @apiSuccess {Date} end_datetime  End date time of the order.
 * @apiSuccess {Number} prices  Price of the order.
 * @apiSuccess {Array} products List of products inside this order.
 * @apiSuccess {String} status  Current order status.
 *
 * @apiError CommandsNotAccessible The model is inaccessible due to server fault.
 */
/**
 * @api {get} /users/:IdUser/orders/ Request Orders information
 * @apiVersion 1.1.0
 * @apiName GetOrders
 * @apiGroup Orders
 * 
 * @apiDescription Was GetCommands in 1.0.0
 *
 * @apiSuccess {String} _id  Unique id of the order.
 * @apiSuccess {Number} IdRestaurant  Unique id of the restaurant related to this order.
 * @apiSuccess {Number} IdUser  Unique id of the user related to this order.
 * @apiSuccess {Number} IdDeliveryDriver  Unique id of the delivery driver related to this order.
 * @apiSuccess {Date} StartDateTime  Start date time of the order.
 * @apiSuccess {Date} EndDateTime  End date time of the order.
 * @apiSuccess {Number} Price  Price of the order.
 * @apiSuccess {Array} Products List of products inside this order.
 * @apiSuccess {String} Status  Current order status.
 * @apiSuccess {Boolean} CouponUsed  Does a coupon was used?
 *
 * @apiError OrdersNotAccessible The model is inaccessible due to server fault.
 */
router.get('/', function(req, res) 
{
    Orders.find({
      IdUser: req.params.IdUser
     }, function (err, docs) 
    {
      if (err)
        res.status(500).json({ message: "OrdersNotAccessible" });
      else
        res.status(200).json(docs);
    });
});


/**
 * @api {get} /orders/:id Request specific Commands information
 * @apiVersion 1.0.0
 * @apiName GetCommand
 * @apiGroup Commands
 *
 * @apiParam {Number} id  Unique id of the order.
 * 
 * @apiSuccess {Number} id  Unique id of the order.
 * @apiSuccess {Number} id_restau  Unique id of the restaurant related to this order.
 * @apiSuccess {Number} id_user  Unique id of the user related to this order.
 * @apiSuccess {Number} id_deliver  Unique id of the delivery driver related to this order.
 * @apiSuccess {Date} start_datetime  Start date time of the order.
 * @apiSuccess {Date} end_datetime  End date time of the order.
 * @apiSuccess {Number} prices  Price of the order.
 * @apiSuccess {Array} products List of products inside this order.
 * @apiSuccess {String} status  Current order status.
 *
 * @apiError CommandNotFound The order was not found.
 */
/**
 * @api {get} /users/:IdUser/orders/:id Request specific Orders information
 * @apiVersion 1.1.0
 * @apiName GetOrder
 * @apiGroup Orders
 * 
 * @apiDescription Was GetCommand in 1.0.0
 *
 * @apiParam {String} id  Unique id of the order.
 * 
 * @apiSuccess {String} _id  Unique id of the order.
 * @apiSuccess {Number} IdRestaurant  Unique id of the restaurant related to this order.
 * @apiSuccess {Number} IdUser  Unique id of the user related to this order.
 * @apiSuccess {Number} IdDeliveryDriver  Unique id of the delivery driver related to this order.
 * @apiSuccess {Date} StartDateTime  Start date time of the order.
 * @apiSuccess {Date} EndDateTime  End date time of the order.
 * @apiSuccess {Number} Price  Price of the order.
 * @apiSuccess {Array} Products List of products inside this order.
 * @apiSuccess {String} Status  Current order status.
 * @apiSuccess {Boolean} CouponUsed  Does a coupon was used?
 *
 * @apiError OrderNotFound The order was not found.
 */
router.get('/:id', function(req, res) 
{
    Orders.find({ 
      _id : req.params.id,
      IdUser: req.params.IdUser
     }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "OrderNotFound" });
      else
        res.status(200).json(docs);
    });
});


/**
 * @api {post} /orders/ Create Commands information
 * @apiVersion 1.0.0
 * @apiName PostCommands
 * @apiGroup Commands
 *
 * @apiParam {Number} id_restau  Unique id of the restaurant related to this order.
 * @apiParam {Number} id_user  Unique id of the user related to this order.
 * @apiParam {Number} id_deliver  Unique id of the delivery driver related to this order.
 * @apiParam {Date} start_datetime  Start date time of the order.
 * @apiParam {Date} end_datetime  End date time of the order.
 * @apiParam {Number} prices  Price of the order.
 * @apiParam {Array} products List of products inside this order.
 * @apiParam {String} status  Current order status.
 * 
 * @apiSuccess {String} message  Commands created.
 *
 * @apiError CommandsNotCreated The order can not be created.
 */
/**
 * @api {post} /users/:IdUser/orders/ Create Orders information
 * @apiVersion 1.1.0
 * @apiName PostOrders
 * @apiGroup Orders
 * 
 * @apiDescription Was PostCommands in 1.0.0
 *
 * @apiParam {Number} IdRestaurant  Unique id of the restaurant related to this order.
 * @apiParam {Number} IdUser  Unique id of the user related to this order.
 * @apiParam {Number} IdDeliveryDriver  Unique id of the delivery driver related to this order.
 * @apiParam {Date} StartDateTime  Start date time of the order.
 * @apiParam {Date} EndDateTime  End date time of the order.
 * @apiParam {Number} Price  Price of the order.
 * @apiParam {Array} Products List of products inside this order.
 * @apiParam {String} Status  Current order status.
 * @apiParam {Boolean} CouponUsed  Does a coupon was used?
 * 
 * @apiSuccess {String} message  Orders created.
 *
 * @apiError OrdersNotCreated The order can not be created.
 */
router.post('/', function(req, res) 
{
    Orders.create({
      IdRestaurant: req.body.IdRestaurant,
      IdUser: req.params.IdUser,
      IdDeliveryDriver: req.body.IdDeliveryDriver,
      StartDateTime: req.body.StartDateTime,
      EndDateTime: req.body.EndDateTime,
      Price: req.body.Price,
      Products: req.body.Products,
      Status: req.body.Status,
      CouponUsed: req.body.CouponUsed,
    }).then((response) => {
      return res.status(201).json({
        message: 'Order created'
      });
    }).catch((error) => {
      return res.status(401).json({
        message: 'OrdersNotCreated',
        stackTrace: error
      });
    });
});


/**
 * @api {put} /orders/:id Update Commands information
 * @apiVersion 1.0.0
 * @apiName PutCommands
 * @apiGroup Commands
 *
 * @apiParam {Number} id  Unique id of the order.
 * @apiParam {Number} id_restau  Unique id of the restaurant related to this order.
 * @apiParam {Number} id_user  Unique id of the user related to this order.
 * @apiParam {Number} id_deliver  Unique id of the delivery driver related to this order.
 * @apiParam {Date} start_datetime  Start date time of the order.
 * @apiParam {Date} end_datetime  End date time of the order.
 * @apiParam {Number} prices  Price of the order.
 * @apiParam {Array} products List of products inside this order.
 * @apiParam {String} status  Current order status.
 * 
 * @apiSuccess {String} message  Commands updated.
 *
 * @apiError CommandsNotUpdated The order can not be updated.
 */
/**
 * @api {put} /users/:IdUser/orders/:id Update Orders information
 * @apiVersion 1.1.0
 * @apiName PutOrders
 * @apiGroup Orders
 * 
 * @apiDescription Was PutCommands in 1.0.0
 *
 * @apiParam {String} id  Unique id of the order.
 * @apiParam {Number} IdDeliveryDriver  Unique id of the delivery driver related to this order.
 * @apiParam {Date} StartDateTime  Start date time of the order.
 * @apiParam {Date} EndDateTime  End date time of the order.
 * @apiParam {String} Status  Current order status.
 * 
 * @apiSuccess {String} message  Orders updated.
 *
 * @apiError OrdersNotUpdated The order can not be updated.
 * @apiError OrderNotExisting The order does not exists.
 * @apiError DatabaseError Database issues.
 */
router.put('/:id', function(req, res) 
{
  Orders.findById(req.params.id).then(function(order) {
    if (!order) {
      return res.status(403).json({
        message: 'OrderNotExisting'
      });
    }

    Orders.updateOne({
      _id: req.params.id,
      IdUser: req.params.IdUser
    }, 
    {
      IdDeliveryDriver : req.body.IdDeliveryDriver,
      StartDateTime : req.body.StartDateTime,
      EndDateTime : req.body.EndDateTime,
      Status : req.body.Status,
    }).then((response) => {
      return res.status(202).json({
        mesage: 'Orders updated'
      });
    }).catch((error) => {
      return res.status(401).json({
        message: 'OrdersNotUpdated',
        stackTrace: error
      });
    });
  }).catch((error) => {
    return res.status(500).json({
      message: 'DatabaseError',
      stackTrace: error
    })
  })
});


/**
 * @api {delete} /orders/:id Delete Commands information
 * @apiVersion 1.0.0
 * @apiName DeleteCommands
 * @apiGroup Commands
 *
 * @apiParam {Number} id  Unique id of the order.
 * 
 * @apiSuccess {String} message  Commands deleted.
 *
 * @apiError CommandsNotDeleted The order can not be deleted.
 */
/**
 * @api {delete} /users/:IdUser/orders/:id Delete Orders information
 * @apiVersion 1.1.0
 * @apiName DeleteOrders
 * @apiGroup Orders
 * 
 * @apiDescription Was DeleteCommands in 1.0.0
 *
 * @apiParam {String} id  Unique id of the order.
 * 
 * @apiSuccess {String} message  Orders deleted.
 *
 * @apiError OrdersNotDeleted The order can not be deleted.
 * @apiError OrderNotExisting The order is not found.
 * @apiError DatabaseError Database issues.
 */
router.delete('/:id', function(req, res)
{
  Orders.findById(req.params.id).then(order => {
    if (!order) {
      return res.status(403).json({
        message: 'OrderNotExisting'
      });
    }

    Orders.deleteOne({ 
      _id: req.params.id,
      IdUser: req.params.IdUser
    }).then((response) => {
      return res.status(203).json({
        message: 'Orders deleted'
      });
    }).catch((error) => {
      return res.status(401).json({
        message: 'OrdersNotDeleted',
        stackTrace: error
      });
    });
  }).catch((error) => {
    return res.status(500).json({
      message: 'DatabaseError',
      stackTrace: error
    })
  })
});

module.exports = router;