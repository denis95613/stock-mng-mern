// src / routes / user.js
'use strict';

// Imports
const express = require('express');

const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Product = require('../models/product');
let Category = require('../models/category');
let Shop = require('../models/shop');
let Store = require('../models/store');

let productRoutes = express.Router();

// Route --------- GET api/products
// Description --- Get all products
productRoutes.get('/api/product', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };

  Product.find()
    .populate('category')
    .populate('shop')
    .populate('store')
    .then((products) => {
      responseData.success = true;
      responseData.data = products;
      return res.json(responseData);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(responseData);
    });
});

productRoutes.post('/api/product/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  let newProduct = new Product({
    ...req.body.product,
    category: req.body.product.category
      ? req.body.product.category._id
      : undefined,
    shop: req.body.product.shop ? req.body.product.shop._id : undefined,
    store: req.body.product.store ? req.body.product.store._id : undefined
  });
  newProduct
    .save()
    .then((p) => {
      Product.findById(p._id)
        .populate('category')
        .populate('shop')
        .populate('store')
        .then((product) => {
          responseData.success = true;
          responseData.data = product;
          return res.json(responseData);
        })
        .catch((e) => res.status(500).json(responseData));
    })
    .catch((err) => res.status(500).json(responseData));
});

productRoutes.post('/api/product', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Product.findByIdAndUpdate(req.body.product._id, req.body.product)
    .then((doc) => {
      if (doc) {
        Product.findById(doc._id)
          .then((u) => {
            Product.findById(u._id)
              .populate('category')
              .populate('shop')
              .populate('store')
              .then((product) => {
                responseData.success = true;
                responseData.data = product;
                return res.json(responseData);
              })
              .catch((ee) => res.status(500).json(responseData));
          })
          .catch((e) => res.status(500).json(responseData));
      }
    })
    .catch((err) => res.status(500).json(responseData));
});

productRoutes.get('/api/product/:productId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.productId) {
    Product.find({ _id: req.params.productId })
      .then((product) => {
        responseData.success = true;
        responseData.data = product;
        return res.json(responseData);
      })
      .catch((err) => res.status(500).json(responseData));
  } else {
    res.json(responseData);
  }
});

productRoutes.delete('/api/product/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Product.findByIdAndRemove(req.params.id, req.body)
    .then((product) => {
      responseData.success = true;
      responseData.data = product;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = productRoutes;
