var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const { Schema } = mongoose;
const productSchema = new Schema({
    IdProduct : Number,
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
 * @api {get} /products/ Recover Products Information
 * @apiVersion 1.1.0
 * @apiName GetProducts
 * @apiGroup Products
 * 
 * @apiSuccess {Number} IdProduct  Product's unique id.
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
    Product.find({}, function (err, docs) 
    {
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
 * @api {get} /products/:id Recover specific Product Information
 * @apiVersion 1.1.0
 * @apiName GetProduct
 * @apiGroup Products
 * 
 * @apiParam {Number} id  Product's unique id.
 * 
 * @apiSuccess {Number} IdProduct  Product's unique id.
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
router.get('/:id', function(req, res) 
{
    Product.find({ IdProduct : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "ProductNotFound" });
      else
        res.status(200).json(docs);
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
 * @api {post} /products/ Create Product Information
 * @apiVersion 1.1.0
 * @apiName PostProducts
 * @apiGroup Products
 * 
 * @apiParam {Number} IdRestaurant  Restaurants's id related to this product.
 * @apiParam {String} Name  Name of this product.
 * @apiParam {String} Description  Description of this product.
 * @apiParam {Array} Picture  Pictures of the product.
 * @apiParam {Array} Size  Sizes available for this product.
 * @apiParam {Number} Notes  Notes of this product.
 * @apiParam {Number} VoteNb  Number of notes.
 * 
 * @apiSuccess {String} message Products added.
 *
 * @apiError ProductNotCreated The product cannot be created.
 */
router.post('/', function(req, res) 
{
    const newProduct = new Product();

    newProduct.IdProduct = req.body.IdProduct;
    newProduct.IdRestaurant = req.body.IdRestaurant;
    newProduct.Name = req.body.Name;
    newProduct.Description = req.body.Description;
    newProduct.Picture = req.body.Picture;
    newProduct.Size = req.body.Size;
    newProduct.Notes = req.body.Notes;
    newProduct.VoteNb = req.body.VoteNb;

    newProduct.save(function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "ProductNotCreated" });
      else
        res.status(201).json({ message: "Products added" });
    });
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
 * @api {put} /products/:id Update Product Information
 * @apiVersion 1.1.0
 * @apiName PutProducts
 * @apiGroup Products
 * 
 * @apiParam {Number} id  Product's unique id.
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
 */
router.put('/:id', function(req, res) 
{
    Product.updateOne({ IdProduct : req.params.id}, 
    {
      IdProduct : req.params.id,
      IdRestaurant : req.body.IdRestaurant,
      Name : req.body.Name,
      Description : req.body.Description,
      Picture : req.body.Picture,
      Size : req.body.Size,
      Notes : req.body.Notes,
      VoteNb : req.body.VoteNb
    },
    function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "ProductNotUpdated" });
      else
        res.status(202).json({ message: "Products updated" });
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
 * @api {delete} /products/:id Delete Product Information
 * @apiVersion 1.1.0
 * @apiName DeleteProducts
 * @apiGroup Products
 * 
 * @apiParam {Number} id  Product's unique id.
 * 
 * @apiSuccess {String} message Products deleted.
 *
 * @apiError ProductNotDeleted The product cannot be deleted.
 */
router.delete('/:id', function(req, res)
{
    Product.deleteOne({ IdProduct : req.params.id }, function (err, docs) 
    {
      if (err)
        res.status(401).json({ message: "ProductNotDeleted" });
      else
        res.status(203).json({ message: "Products deleted" });
    });
});

module.exports = router;