'use strict';

const express = require('express');
const isEmpty = require('lodash/isEmpty');

const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Store = require('../models/store');

let storeRoutes = express.Router();

// Route --------- GET api/stores
// Description --- Get all stores
storeRoutes.get('/api/store', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };

  Store.find()
    .then((stores) => {
      responseData.success = true;
      responseData.data = stores;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

storeRoutes.post('/api/store/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Store.create(req.body.store)
    .then((store) => {
      responseData.success = true;
      responseData.data = store;
      return res.json(responseData);
    })
    .catch((err) => res.status(400).json(responseData));
});

storeRoutes.post('/api/store', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Store.findByIdAndUpdate(req.body.store._id, req.body.store)
    .then((doc) => {
      if (doc) {
        Store.findById(doc._id)
          .then((store) => {
            responseData.success = true;
            responseData.data = store;
            return res.json(responseData);
          })
          .catch((e) => res.status(400).json(responseData));
      }
    })
    .catch((err) => res.status(400).json(responseData));
});

storeRoutes.get('/api/store/:storeId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.storeId) {
    Store.find({ _id: req.params.storeId })
      .then((store) => {
        responseData.success = true;
        responseData.data = store;
        return res.json(responseData);
      })
      .catch((err) => res.status(400).json(responseData));
  } else {
    res.json(responseData);
  }
});

storeRoutes.delete('/api/store/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Store.findByIdAndRemove(req.params.id, req.body)
    .then((store) => {
      responseData.success = true;
      responseData.data = store;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = storeRoutes;
