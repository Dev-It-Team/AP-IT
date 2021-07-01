var express = require('express');
var router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const Orders = mongoose.model('Orders');

router.get('/:id', function(req, res) 
{
  switch(req.body.UserFlag) {
    case 0:
      Orders.find({ 
        IdUser: req.params.id
        }, function (err, docs) 
      {
        if (err)
          res.status(401).json({ message: "OrderNotFound" });
        else
          res.status(200).json(docs);
      });
      break;

    case 1:
      Orders.find({ 
        IdRestaurant: req.params.id
        }, function (err, docs) 
      {
        if (err)
          res.status(401).json({ message: "OrderNotFound" });
        else
          res.status(200).json(docs);
      });
      break;

    case 2:
      Orders.find({ 
        IdDeliveryDriver: null,
        Status: 2
        }, function (err, docs) 
      {
        if (err)
          res.status(401).json({ message: "OrderNotFound" });
        else {
          Orders.find({ 
            IdDeliveryDriver: req.params.id,
            Status: 3
            }, function (err, newDocs) 
          {
            if (err)
              res.status(401).json({ message: "OrderNotFound" });
            else {
              res.status(200).json(docs.concat(newDocs));
            }
          });
        }
      });
      break;
  }
});

module.exports = router;