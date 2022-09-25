'use strict';
const express = require('express');
const _ = require('lodash');
const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Sell = require('../models/sell');
let Stock = require('../models/stock');
let Transfer = require('../models/transfer');
let Notification = require('../models/notification');

let sellRoutes = express.Router();

// Route --------- GET api/sells
// Description --- Get all sells
sellRoutes.get('/api/sell', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };

  Sell.find()
    .populate('customer')
    .populate('shop')
    // .populate('invoice')
    .populate('user')
    .populate('items.product')
    .then((sells) => {
      responseData.success = true;
      responseData.data = sells;
      return res.json(responseData);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(responseData);
    });
});

sellRoutes.post('/api/sell/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  let { sell } = req.body;

  const saveSell = new Promise((resolve, reject) => {
    let newSell = new Sell({
      ...sell,
      customer: sell.customer ? sell.customer._id : undefined,
      invoice: sell.invoice ? sell.invoice._id : undefined,
      shop: sell.shop ? sell.shop._id : undefined,
      added_by: sell.added_by ? sell.added_by._id : undefined
    });
    console.log(newSell, '--------newsell');
    newSell
      .save()
      .then((p) => {
        Sell.findById(p._id)
          .populate('invoice')
          .populate('customer')
          .populate('shop')
          .populate('added_by')
          .populate('items.product')
          .then((sell) => {
            resolve(sell);
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

  const saveTransfer = new Promise((resolve, reject) => {
    let newTransfer = new Transfer({
      // date: ,
      from: {
        shop: sell.shop ? sell.shop._id : undefined
      },
      to: {
        customer: sell.customer ? sell.customer._id : undefined
      },
      status: {},
      total_amount: sell.total_amount,
      items: sell.items
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

  const changeShop = new Promise((resolve, reject) => {
    let items = sell.items;
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
    let items = sell.items;
    let notes = [];
    if (items.length === 0) {
      resolve([]);
    } else {
      items.forEach((item) => {
        let quantity = item.stock.quantity - item.amount;
        if (quantity <= item.stock.limit_quantity) {
          let newNofitication = new Notification({
            title: `Low quantity - ${item.stock.product.name}`,
            content: `${item.stock.shop.name}'s ${item.stock.product.name} quantity is ${quantity}`
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

  Promise.all([saveSell, saveTransfer, changeShop, saveNote]).then((values) => {
    console.log(values);
    responseData.success = true;
    responseData.data = values[0];
    return res.json(responseData);
  });
});

sellRoutes.post('/api/sell', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  console.log(req.body.sell._id, req.body.sell, '---------req.body in server');
  Sell.findByIdAndUpdate(req.body.sell._id, {
    ...req.body.sell,
    customer: _.get(req.body, 'sell.customer._id'),
    invoice: _.get(req.body, 'sell.invoice._id'),
    shop: _.get(req.body, 'sell.shop._id'),
    added_by: _.get(req.body, 'sell.added_by._id')
  })
    .then((doc) => {
      if (doc) {
        Sell.findById(doc._id)
          .populate('customer')
          .populate('invoice')
          .populate('shop')
          .populate('added_by')
          .populate('items.product')
          .then((sell) => {
            1;
            responseData.success = true;
            responseData.data = sell;
            return res.json(responseData);
          })
          .catch((ee) => res.status(500).json(responseData));
      }
    })
    .catch((err) => res.status(500).json(responseData));
});

sellRoutes.get('/api/sell/:sellId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.sellId) {
    Sell.find({ _id: req.params.sellId })
      .then((sell) => {
        responseData.success = true;
        responseData.data = sell;
        return res.json(responseData);
      })
      .catch((err) => res.status(500).json(responseData));
  } else {
    res.json(responseData);
  }
});

sellRoutes.delete('/api/sell/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  Sell.findByIdAndRemove(req.params.id, req.body)
    .then((sell) => {
      responseData.success = true;
      responseData.data = sell;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = sellRoutes;
