'use strict';
const express = require('express');
const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Stock = require('../models/stock');
let User = require('../models/user');
let Shop = require('../models/shop');
let Store = require('../models/store');
let Product = require('../models/product');

let stockRoutes = express.Router();

// Route --------- GET api/stocks
// Description --- Get all stocks
stockRoutes.get('/api/stock', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };
  console.log('-------stock in server');
  Stock.find()
    .populate('shop')
    .populate('store')
    .populate('user')
    .populate('product')
    .then((stocks) => {
      responseData.success = true;
      responseData.data = stocks;
      return res.json(responseData);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(responseData);
    });
});

stockRoutes.get('/api/stock/:shopId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };

  if (req.params.shopId) {
    Stock.find({ shop: req.params.shopId })
      .populate('shop')
      .populate('store')
      .populate('user')
      .populate('product')
      .then((stocks) => {
        responseData.success = true;
        responseData.data = stocks;
        return res.json(responseData);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(responseData);
      });
  } else {
    res.json(responseData);
  }
});

stockRoutes.post('/api/stock/stores', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };
  let { products } = req.body;
  let query = {};
  let queries = [];
  products.forEach((item) => {
    queries = [
      ...queries,
      {
        $and: [
          { product: item.product },
          { quantity: { $gt: item.amount } },
          { store: { $exists: true } }
        ]
      }
    ];
  });
  if (queries.length > 0) query = { ...query, $or: queries };
  // console.log(queries, '----queries', query, '---query');
  // console.log(query, '---query');
  Stock.find(query)
    .populate('store')
    .populate('product')
    .then((stocks) => {
      // console.log(stocks, '++++++stocks');
      let s = stocks.map((stock) => {
        let unit_price = 0;
        if (stock.discount > 0) {
          unit_price = ((100 - stock.discount) / 100) * stock.regular_price;
        } else if (stock.sale_price) {
          unit_price = stock.sale_price;
        } else {
          unit_price = stock.regular_price;
        }
        return {
          // stock: stock._id,
          stock,
          store: stock.store,
          product: {
            _id: stock.product._id,
            name: stock.product.name
          },
          amount: products.filter(
            (p) => p.product === stock.product._id.toString()
          )[0].amount,
          quantity: stock.quantity,
          limit_quantity: stock.limit_quantity,
          unit_price: unit_price,
          regular_price: stock.regular_price,
          sale_price: stock.sale_price,
          discount: stock.discount,
          skucode: stock.skucode
        };
      });
      responseData.success = true;
      responseData.data = s;
      return res.json(responseData);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(responseData);
    });
});

stockRoutes.post('/api/stock/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  let newStock = new Stock({
    ...req.body.stock,
    shop: req.body.stock.shop ? req.body.stock.shop._id : undefined,
    store: req.body.stock.store ? req.body.stock.store._id : undefined,
    product: req.body.stock.product ? req.body.stock.product._id : undefined,
    added_by: req.body.stock.added_by ? req.body.stock.added_by._id : undefined
  });
  console.log(newStock, '--------newstock');
  newStock
    .save()
    .then((p) => {
      Stock.findById(p._id)
        .populate('shop')
        .populate('store')
        .populate('product')
        .populate('added_by')
        .then((stock) => {
          responseData.success = true;
          responseData.data = stock;
          return res.json(responseData);
        })
        .catch((e) => res.status(500).json(responseData));
    })
    .catch((err) => res.status(500).json(responseData));
});

stockRoutes.post('/api/stock', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  console.log(
    req.body.stock._id,
    req.body.stock,
    '---------req.body in server'
  );
  Stock.findByIdAndUpdate(req.body.stock._id, {
    ...req.body.stock,
    shop: req.body.stock.shop ? req.body.stock.shop._id : undefined,
    store: req.body.stock.store ? req.body.stock.store._id : undefined,
    product: req.body.stock.product ? req.body.stock.product._id : undefined,
    added_by: req.body.stock.added_by ? req.body.stock.added_by._id : undefined
  })
    .then((doc) => {
      if (doc) {
        Stock.findById(doc._id)
          .populate('shop')
          .populate('store')
          .populate('product')
          .populate('added_by')
          .then((stock) => {
            1;
            responseData.success = true;
            responseData.data = stock;
            return res.json(responseData);
          })
          .catch((ee) => res.status(500).json(responseData));
      }
    })
    .catch((err) => res.status(500).json(responseData));
});

stockRoutes.get('/api/stock/:stockId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.stockId) {
    Stock.find({ _id: req.params.stockId })
      .then((stock) => {
        responseData.success = true;
        responseData.data = stock;
        return res.json(responseData);
      })
      .catch((err) => res.status(500).json(responseData));
  } else {
    res.json(responseData);
  }
});

stockRoutes.delete('/api/stock/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  Stock.findByIdAndRemove(req.params.id, req.body)
    .then((stock) => {
      responseData.success = true;
      responseData.data = stock;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = stockRoutes;
