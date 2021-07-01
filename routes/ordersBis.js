var express = require('express');
var router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const Orders = mongoose.model('Orders');
const jwt = require('jsonwebtoken');
const { getToken } = require('../jwtMiddleware');

router.get('/:id', function(req, res) 
{
  const token = getToken(req);

    if (!token) 
      return res.status(401).json({ message: 'TokenEmpty' });
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
          return res.status(401).json({ message: 'BadToken' });
      } else {
        if (decodedToken.UserFlag == '0') {
          Orders.find({ 
            IdUser: req.params.id
            }, function (err, docs) 
          {
            if (err)
              res.status(401).json({ message: "OrderNotFound" });
            else
              res.status(200).json(docs);
          });
        }
        else if (decodedToken.UserFlag == '1') {
          Orders.find({ 
            IdRestaurant: req.params.id
            }, function (err, docs) 
          {
            if (err)
              res.status(401).json({ message: "OrderNotFound" });
            else
              res.status(200).json(docs);
          });
        }
        else if (decodedToken.UserFlag == '2') {
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
        }
      }
    });
});

module.exports = router;