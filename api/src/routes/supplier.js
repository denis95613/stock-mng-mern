'use strict';

const express = require('express');
const isEmpty = require('lodash/isEmpty');

const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Supplier = require('../models/supplier');

let supplierRoutes = express.Router();

// Route --------- GET api/suppliers
// Description --- Get all suppliers
supplierRoutes.get('/api/supplier', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };

  Supplier.find()
    .then((suppliers) => {
      responseData.success = true;
      responseData.data = suppliers;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

supplierRoutes.post('/api/supplier/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Supplier.create(req.body.supplier)
    .then((supplier) => {
      responseData.success = true;
      responseData.data = supplier;
      return res.json(responseData);
    })
    .catch((err) => res.status(400).json(responseData));
});

supplierRoutes.post('/api/supplier', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Supplier.findByIdAndUpdate(req.body.supplier._id, req.body.supplier)
    .then((doc) => {
      if (doc) {
        Supplier.findById(doc._id)
          .then((supplier) => {
            responseData.success = true;
            responseData.data = supplier;
            return res.json(responseData);
          })
          .catch((e) => res.status(400).json(responseData));
      }
    })
    .catch((err) => res.status(400).json(responseData));
});

supplierRoutes.get('/api/supplier/:supplierId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.supplierId) {
    Supplier.find({ _id: req.params.supplierId })
      .then((supplier) => {
        responseData.success = true;
        responseData.data = supplier;
        return res.json(responseData);
      })
      .catch((err) => res.status(400).json(responseData));
  } else {
    res.json(responseData);
  }
});

supplierRoutes.delete('/api/supplier/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Supplier.findByIdAndRemove(req.params.id, req.body)
    .then((supplier) => {
      responseData.success = true;
      responseData.data = supplier;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = supplierRoutes;
