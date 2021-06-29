var express = require('express');
var router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');

const { Schema } = mongoose;
const productSchema = new Schema({
    IdRestaurant: Number,
    Name: String,
    Description: String,
    Picture: Array,
    Sizes: Array,
    Notes: Number,
    VoteNb: Number
})
const Product = mongoose.model('Product', productSchema);


/**
 * @api {get} /products/ Recover Products Information
 * @apiVersion 1.0.0
 * @apiName GetProducts
 * @apiGroup Products
 * 
 * @apiSuccess {Number} id  Product's unique id.
 * @apiSuccess {Number} id_restau  Restaurants's id related to this product.
 * @apiSuccess {String} name  Name of this product.
 * @apiSuccess {String} description  Description of this product.
 * @apiSuccess {Array} pictures  Pictures of the product.
 * @apiSuccess {Array} sizes  Sizes available for this product.
 * @apiSuccess {Number} notes  Notes of this product.
 * @apiSuccess {Number} notes_number  Number of notes.
 *
 * @apiError ProductsNotAccessible The table is inaccessible due to server fault.
 */
/**
 * @api {get} /restaurants/:IdRestaurant/products/ Recover Products Information
 * @apiVersion 1.1.0
 * @apiName GetProducts
 * @apiGroup Products
 * 
 * @apiDescription Returns an array of information.
 * 
 * @apiSuccess {String} _id  Product's unique id.
 * @apiSuccess {Number} IdRestaurant  Restaurants's id related to this product.
 * @apiSuccess {String} Name  Name of this product.
 * @apiSuccess {String} Description  Description of this product.
 * @apiSuccess {Array} Picture  Pictures of the product.
 * @apiSuccess {Array} Sizes  Sizes available for this product.
 * @apiSuccess {Number} Notes  Notes of this product.
 * @apiSuccess {Number} VoteNb  Number of notes.
 *
 * @apiError ProductsNotAccessible The table is inaccessible due to server fault.
 */
router.get('/', function(req, res) 
{
    Product.find({
        IdRestaurant: JSON.parse(req.params.IdRestaurant)
    }, (err, docs) => {
        if (err)
            res.status(500).json({ message: "ProductsNotAccessible" });
        else
            res.status(200).json(docs);
    });
});


/**
 * @api {get} /products/:id Recover specific Product Information
 * @apiVersion 1.0.0
 * @apiName GetProduct
 * @apiGroup Products
 * 
 * @apiParam {Number} id  Product's unique id.
 * 
 * @apiSuccess {Number} id  Product's unique id.
 * @apiSuccess {Number} id_restau  Restaurants's id related to this product.
 * @apiSuccess {String} name  Name of this product.
 * @apiSuccess {String} description  Description of this product.
 * @apiSuccess {Array} pictures  Pictures of the product.
 * @apiSuccess {Array} sizes  Sizes available for this product.
 * @apiSuccess {Number} notes  Notes of this product.
 * @apiSuccess {Number} notes_number  Number of notes.
 *
 * @apiError ProductNotFound The products was not found.
 */
/**
 * @api {get} /restaurants/:IdRestaurant/products/:id Recover specific Product Information
 * @apiVersion 1.1.0
 * @apiName GetProduct
 * @apiGroup Products
 * 
 * @apiParam {String} IdProduct  Product's unique id.
 * 
 * @apiSuccess {String} _id  Product's unique id.
 * @apiSuccess {Number} IdRestaurant  Restaurants's id related to this product.
 * @apiSuccess {String} Name  Name of this product.
 * @apiSuccess {String} Description  Description of this product.
 * @apiSuccess {Array} Picture  Pictures of the product.
 * @apiSuccess {Array} Sizes  Sizes available for this product.
 * @apiSuccess {Number} Notes  Notes of this product.
 * @apiSuccess {Number} VoteNb  Number of notes.
 *
 * @apiError ProductNotFound The products was not found.
 */
router.get('/:IdProduct', function(req, res) 
{
    Product.findOne({
        IdRestaurant: req.params.IdRestaurant,
        _id: req.params.IdProduct
    }).then(function(product) {
        if (product) {
            return res.status(200).json(product);
        }
    }).catch((error) => {
        return res.status(401).json({ 
            message: "ProductNotFound",
            stackTrace : error
        });
    });
});


/**
 * @api {post} /products/ Create Product Information
 * @apiVersion 1.0.0
 * @apiName PostProducts
 * @apiGroup Products
 * 
 * @apiParam {Number} id_restau  Restaurants's id related to this product.
 * @apiParam {String} name  Name of this product.
 * @apiParam {String} description  Description of this product.
 * @apiParam {Array} pictures  Pictures of the product.
 * @apiParam {Array} sizes  Sizes available for this product.
 * @apiParam {Number} notes  Notes of this product.
 * @apiParam {Number} notes_number  Number of notes.
 * 
 * @apiSuccess {String} message Products added.
 *
 * @apiError ProductNotCreated The product cannot be created.
 */
/**
 * @api {post} /restaurants/:IdRestaurant/products/ Create Product Information
 * @apiVersion 1.1.0
 * @apiName PostProducts
 * @apiGroup Products
 * 
 * @apiParam {Number} IdRestaurant  Restaurants's id related to this product.
 * @apiParam {String} Name  Name of this product.
 * @apiParam {String} Description  Description of this product.
 * @apiParam {Array} Picture  Pictures of the product.
 * @apiParam {Array} Size  Sizes available for this product.
 * 
 * @apiSuccess {String} message Products added.
 *
 * @apiError ProductNotCreated The product cannot be created.
 * @apiError DuplicateProduct Product already present.
 * @apiError DatabaseError Database issues.
 */
router.post('/', function(req, res) 
{
    Product.findOne({
        where:  {
            IdRestaurant: req.params.IdRestaurant,
            Name: req.body.Name
        }
    }).then(function(product) {
        if (product) {
            return res.status(403).json({
                message: 'DuplicateProduct'
            });
        }

        Product.create({
            IdRestaurant: req.params.IdRestaurant,
            Name: req.body.Name,
            Description: req.body.Description,
            Picture: req.body.Picture,
            Size: req.body.Size,
            Notes: 0,
            VoteNb: 0
        }).then((response) => {
            return res.status(201).json({
                message: 'Product created'
            });
        }).catch((error) => {
            return res.status(401).json({
                message: 'ProductNotCreated',
                stackTrace: error
            })
        })
    }).catch((error) => {
        return res.status(500).json({
            message: 'DatabaseError',
            stackTrace: error
        });
    })
});


/**
 * @api {put} /products/:id Update Product Information
 * @apiVersion 1.0.0
 * @apiName PutProducts
 * @apiGroup Products
 * 
 * @apiParam {Number} id  Product's unique id.
 * @apiParam {Number} id_restau  Restaurants's id related to this product.
 * @apiParam {String} name  Name of this product.
 * @apiParam {String} description  Description of this product.
 * @apiParam {Array} pictures  Pictures of the product.
 * @apiParam {Array} sizes  Sizes available for this product.
 * @apiParam {Number} notes  Notes of this product.
 * @apiParam {Number} notes_number  Number of notes.
 * 
 * @apiSuccess {String} message Products updated.
 *
 * @apiError ProductNotUpdated The product cannot be updated.
 */
/**
 * @api {put} /restaurants/:IdRestaurant/products/:id Update Product Information
 * @apiVersion 1.1.0
 * @apiName PutProducts
 * @apiGroup Products
 * 
 * @apiParam {String} IdProduct  Product's unique id.
 * @apiParam {Number} IdRestaurant  Restaurants's id related to this product.
 * @apiParam {String} Name  Name of this product.
 * @apiParam {String} Description  Description of this product.
 * @apiParam {Array} Picture  Pictures of the product.
 * @apiParam {Array} Size  Sizes available for this product.
 * @apiParam {Number} Notes  Notes of this product.
 * @apiParam {Number} VoteNb  Number of notes.
 * 
 * @apiSuccess {String} message Products updated.
 *
 * @apiError ProductNotUpdated The product cannot be updated.
 * @apiError ProductNotExisting The product does not exists.
 * @apiError DatabaseError Database issues.
 */
router.put('/:IdProduct', function(req, res) 
{
    Product.findById(req.params.IdProduct).then(function(product) {
        if (!product) {
            return res.status(403).json({
                message: 'ProductNotExisting'
            });
        }

        Product.updateOne({
            _id: req.params.IdProduct,
            IdRestaurant: req.params.IdRestaurant,
          }, {
            IdRestaurant: req.params.IdRestaurant,
            Name: req.body.Name,
            Description: req.body.Description,
            Picture: req.body.Picture,
            Size: req.body.Size,
            Notes: req.body.Notes,
            VoteNb: req.body.VoteNb
        }).then((response) => {
            return res.status(202).json({
                message: 'Product updated'
            });
        }).catch((error) => {
            return res.status(401).json({
                message: 'ProductNotUpdated',
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
 * @api {delete} /products/:id Delete Product Information
 * @apiVersion 1.0.0
 * @apiName DeleteProducts
 * @apiGroup Products
 * 
 * @apiParam {Number} id  Product's unique id.
 * 
 * @apiSuccess {String} message Products deleted.
 *
 * @apiError ProductNotDeleted The product cannot be deleted.
 */
/**
 * @api {delete} /restaurants/:IdRestaurant/products/:id Delete Product Information
 * @apiVersion 1.1.0
 * @apiName DeleteProducts
 * @apiGroup Products
 * 
 * @apiParam {Number} IdProduct  Product's unique id.
 * 
 * @apiSuccess {String} message Products deleted.
 *
 * @apiError ProductNotDeleted The product cannot be deleted.
 * @apiError ProductNotExisting The product cannot be found.
 * @apiError DatabaseError Database issues.
 */
router.delete('/:IdProduct', function(req, res)
{
    Product.findById(req.params.IdProduct).then(function(product) {
        if (!product) {
            return res.status(403).json({
                message: 'ProductNotExisting'
            });
        }

        Product.deleteOne({
            _id: req.params.IdProduct,
            IdRestaurant: req.params.IdRestaurant,
        }).then((response) => {
            return res.status(203).json({
                message: 'Product deleted'
            });
        }).catch((error) => {
            return res.status(401).json({
                message: 'ProductNotDeleted',
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

module.exports = router;