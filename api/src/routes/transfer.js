'use strict';
const express = require('express');
const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Transfer = require('../models/transfer');
let Shop = require('../models/shop');
let Store = require('../models/store');
let Customer = require('../models/customer');
let Supplier = require('../models/supplier');
const _ = require('lodash');

let transferRoutes = express.Router();

// Route --------- GET api/transfers
// Description --- Get all transfers
transferRoutes.get('/api/transfer', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };

  Transfer.find()
    .populate('from.shop')
    .populate('from.store')
    .populate('from.supplier')
    .populate('to.shop')
    .populate('to.store')
    .populate('to.customer')
    .then((transfers) => {
      responseData.success = true;
      responseData.data = transfers;
      return res.json(responseData);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(responseData);
    });
});

transferRoutes.post('/api/transfer/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  let { transfer } = req.body;
  console.log(transfer, '------transfer in server');
  let newTransfer = new Transfer({
    ...transfer,
    from: {
      shop: _.get(transfer, 'from.shop._id'),
      store: _.get(transfer, 'from.store._id'),
      supplier: _.get(transfer, 'from.supplier._id')
    },
    to: {
      shop: _.get(transfer, 'to.shop._id'),
      store: _.get(transfer, 'to.store._id'),
      customer: _.get(transfer, 'to.customer._id')
    }
  });
  newTransfer
    .save()
    .then((p) => {
      Transfer.findById(p._id)
        .populate('from.shop')
        .populate('from.store')
        .populate('from.supplier')
        .populate('to.shop')
        .populate('to.store')
        .populate('to.customer')
        .then((transfer) => {
          responseData.success = true;
          responseData.data = transfer;
          return res.json(responseData);
        })
        .catch((e) => res.status(500).json(responseData));
    })
    .catch((err) => res.status(500).json(responseData));
});

transferRoutes.post('/api/transfer', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  let { transfer } = req.body;
  Transfer.findByIdAndUpdate(req.body.transfer._id, {
    ...transfer,
    from: {
      shop: _.get(transfer, 'from.shop._id'),
      store: _.get(transfer, 'from.store._id'),
      supplier: _.get(transfer, 'from.supplier._id')
    },
    to: {
      shop: _.get(transfer, 'to.shop._id'),
      store: _.get(transfer, 'to.store._id'),
      customer: _.get(transfer, 'to.customer._id')
    }
  })
    .then((doc) => {
      if (doc) {
        Transfer.findById(doc._id)
          .then((u) => {
            Transfer.findById(u._id)
              .populate('from.shop')
              .populate('from.store')
              .populate('from.supplier')
              .populate('to.shop')
              .populate('to.store')
              .populate('to.customer')
              .then((transfer) => {
                responseData.success = true;
                responseData.data = transfer;
                return res.json(responseData);
              })
              .catch((ee) => res.status(500).json(responseData));
          })
          .catch((e) => res.status(500).json(responseData));
      }
    })
    .catch((err) => res.status(500).json(responseData));
});

transferRoutes.get('/api/transfer/:transferId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.transferId) {
    Transfer.find({ _id: req.params.transferId })
      .then((transfer) => {
        responseData.success = true;
        responseData.data = transfer;
        return res.json(responseData);
      })
      .catch((err) => res.status(500).json(responseData));
  } else {
    res.json(responseData);
  }
});

transferRoutes.delete('/api/transfer/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Transfer.findByIdAndRemove(req.params.id, req.body)
    .then((transfer) => {
      responseData.success = true;
      responseData.data = transfer;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = transferRoutes;
