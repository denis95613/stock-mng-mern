'use strict';
const express = require('express');
const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Recepit = require('../models/recepit');
let Stock = require('../models/stock');
let User = require('../models/user');
let Shop = require('../models/shop');
let Store = require('../models/store');
let Product = require('../models/product');
let Transfer = require('../models/transfer');
let Notification = require('../models/notification');

let recepitRoutes = express.Router();

// Route --------- GET api/recepits
// Description --- Get all recepits
recepitRoutes.get('/api/recepit', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };
  console.log('-------recepit in server');
  Recepit.find()
    .populate('customer')
    .populate('items.stock')
    .populate('items.store')
    .populate('items.product')
    .then((recepits) => {
      responseData.success = true;
      responseData.data = recepits;
      return res.json(responseData);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(responseData);
    });
});

recepitRoutes.post('/api/recepit/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  let { recepit } = req.body;
  const saveRecepit = new Promise((resolve, reject) => {
    let newRecepit = new Recepit({
      ...recepit
    });
    console.log(newRecepit, '--------newRecepit in recepit');
    newRecepit
      .save()
      .then((p) => {
        Recepit.findById(p._id)
          .populate('customer')
          .populate('items.stock')
          .populate('items.store')
          .populate('items.product')
          .then((recepit) => resolve(recepit))
          .catch((e) => res.status(500).json(responseData));
      })
      .catch((err) => res.status(500).json(responseData));
  });

  const saveTransfer = new Promise((resolve, reject) => {
    let newTransfer = new Transfer({
      // date: ,
      from: {
        shop: recepit.shop
      },
      to: {
        customer: recepit.customer
      },
      status: {},
      total_amount: recepit.total_amount,
      items: recepit.items
    });
    newTransfer
      .save()
      .then((t) => {
        Transfer.findById(t._id)
          .populate('from.shop')
          .populate('from.store')
          .populate('from.supplier')
          .populate('to.shop')
          .populate('to.store')
          .populate('to.customer')
          .then((transfer) => {
            resolve(transfer);
          })
          .catch((e) => {
            console.log(e);
            return res.status(500).json(responseData);
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(responseData);
      });
  });

  const changeStore = new Promise((resolve, reject) => {
    let items = recepit.items;
    let stocks = [];
    if (items.length === 0) {
      resolve({});
    } else {
      items.forEach((item) => {
        let quantity = item.stock.quantity - item.amount;
        Stock.findByIdAndUpdate(item.stock._id, { quantity })
          .then((doc) => {
            stocks.push(doc);
          })
          .catch((err) => res.status(500).json(responseData));
      });
      resolve(stocks);
    }
  });

  const saveNote = new Promise((resolve, reject) => {
    let items = recepit.items;
    let notes = [];
    if (items.length === 0) {
      resolve([]);
    } else {
      items.forEach((item) => {
        let quantity = item.stock.quantity - item.amount;
        if (quantity <= item.stock.limit_quantity) {
          let newNofitication = new Notification({
            title: `Low quantity - ${item.stock.product.name}`,
            content: `${item.stock.store.name}'s ${item.stock.product.name} quantity is ${quantity}`
          });
          newNofitication
            .save()
            .then((note) => {
              notes.push(note);
            })
            .catch((e) => res.status(500).json(responseData));
        }
      });
      resolve(notes);
    }
  });

  Promise.all([saveRecepit, saveTransfer, changeStore, saveNote]).then(
    (values) => {
      console.log(values);
      responseData.success = true;
      responseData.data = values[0];
      return res.json(responseData);
    }
  );
});

recepitRoutes.post('/api/recepit', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  console.log(
    req.body.recepit._id,
    req.body.recepit,
    '---------req.body in server'
  );
  Recepit.findByIdAndUpdate(req.body.recepit._id, {
    ...req.body.recepit
  })
    .then((doc) => {
      if (doc) {
        Recepit.findById(doc._id)
          .populate('customer')
          .populate('items.stock')
          .populate('items.store')
          .populate('items.product')
          .then((recepit) => {
            responseData.success = true;
            responseData.data = recepit;
            return res.json(responseData);
          })
          .catch((ee) => res.status(500).json(responseData));
      }
    })
    .catch((err) => res.status(500).json(responseData));
});

recepitRoutes.get('/api/recepit/:recepitId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.recepitId) {
    Recepit.find({ _id: req.params.recepitId })
      .then((recepit) => {
        responseData.success = true;
        responseData.data = recepit;
        return res.json(responseData);
      })
      .catch((err) => res.status(500).json(responseData));
  } else {
    res.json(responseData);
  }
});

recepitRoutes.delete('/api/recepit/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  Recepit.findByIdAndRemove(req.params.id, req.body)
    .then((recepit) => {
      responseData.success = true;
      responseData.data = recepit;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = recepitRoutes;
