'use strict';

const express = require('express');
const isEmpty = require('lodash/isEmpty');

const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Customer = require('../models/customer');

let customerRoutes = express.Router();

// Route --------- GET api/customers
// Description --- Get all customers
customerRoutes.get('/api/customer', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };

  Customer.find()
    .then((customers) => {
      responseData.success = true;
      responseData.data = customers;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

customerRoutes.post('/api/customer/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Customer.create(req.body.customer)
    .then((customer) => {
      responseData.success = true;
      responseData.data = customer;
      return res.json(responseData);
    })
    .catch((err) => res.status(400).json(responseData));
});

customerRoutes.post('/api/customer', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Customer.findByIdAndUpdate(req.body.customer._id, req.body.customer)
    .then((doc) => {
      if (doc) {
        Customer.findById(doc._id)
          .then((customer) => {
            responseData.success = true;
            responseData.data = customer;
            return res.json(responseData);
          })
          .catch((e) => res.status(400).json(responseData));
      }
    })
    .catch((err) => res.status(400).json(responseData));
});

customerRoutes.get('/api/customer/:customerId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.customerId) {
    Customer.find({ _id: req.params.customerId })
      .then((customer) => {
        responseData.success = true;
        responseData.data = customer;
        return res.json(responseData);
      })
      .catch((err) => res.status(400).json(responseData));
  } else {
    res.json(responseData);
  }
});

customerRoutes.delete('/api/customer/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Customer.findByIdAndRemove(req.params.id, req.body)
    .then((customer) => {
      responseData.success = true;
      responseData.data = customer;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = customerRoutes;
