'use strict';

const express = require('express');
const isEmpty = require('lodash/isEmpty');

const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Shop = require('../models/shop');

let shopRoutes = express.Router();

// Route --------- GET api/shops
// Description --- Get all shops
shopRoutes.get('/api/shop', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };

  Shop.find()
    .then((shops) => {
      responseData.success = true;
      responseData.data = shops;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

shopRoutes.post('/api/shop/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Shop.create(req.body.shop)
    .then((shop) => {
      responseData.success = true;
      responseData.data = shop;
      return res.json(responseData);
    })
    .catch((err) => res.status(400).json(responseData));
});

shopRoutes.post('/api/shop', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Shop.findByIdAndUpdate(req.body.shop._id, req.body.shop)
    .then((doc) => {
      if (doc) {
        Shop.findById(doc._id)
          .then((shop) => {
            responseData.success = true;
            responseData.data = shop;
            return res.json(responseData);
          })
          .catch((e) => res.status(400).json(responseData));
      }
    })
    .catch((err) => res.status(400).json(responseData));
});

shopRoutes.get('/api/shop/:shopId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.shopId) {
    Shop.find({ _id: req.params.shopId })
      .then((shop) => {
        responseData.success = true;
        responseData.data = shop;
        return res.json(responseData);
      })
      .catch((err) => res.status(400).json(responseData));
  } else {
    res.json(responseData);
  }
});

shopRoutes.delete('/api/shop/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Shop.findByIdAndRemove(req.params.id, req.body)
    .then((shop) => {
      responseData.success = true;
      responseData.data = shop;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = shopRoutes;
