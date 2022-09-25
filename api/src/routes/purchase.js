'use strict';
const express = require('express');
const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Purchase = require('../models/purchase');
let Transfer = require('../models/transfer');
let Stock = require('../models/stock');
let User = require('../models/user');
let Supplier = require('../models/supplier');

let purchaseRoutes = express.Router();

// Route --------- GET api/purchases
// Description --- Get all purchases
purchaseRoutes.get('/api/purchase', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };

  Purchase.find()
    .populate('supplier')
    .populate('shop')
    .populate('user')
    .populate('items.product')
    .then((purchases) => {
      responseData.success = true;
      responseData.data = purchases;
      return res.json(responseData);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(responseData);
    });
});

purchaseRoutes.post('/api/purchase/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  let { purchase } = req.body;
  console.log(purchase, '------purchase in purchase add');
  // let newPurchase = new Purchase({
  //   ...req.body.purchase,
  //   supplier: req.body.purchase.supplier
  //     ? req.body.purchase.supplier._id
  //     : undefined,
  //   shop: req.body.purchase.shop ? req.body.purchase.shop._id : undefined,
  //   added_by: req.body.purchase.added_by
  //     ? req.body.purchase.added_by._id
  //     : undefined
  // });

  // newPurchase
  //   .save()
  //   .then((p) => {
  //     Purchase.findById(p._id)
  //       .populate('supplier')
  //       .populate('shop')
  //       .populate('added_by')
  //       .populate('items.product')
  //       .then((purchase) => {
  //         responseData.success = true;
  //         responseData.data = purchase;
  //         return res.json(responseData);
  //       })
  //       .catch((e) => res.status(500).json(responseData));
  //   })
  //   .catch((err) => res.status(500).json(responseData));

  const savePurchase = new Promise((resolve, reject) => {
    let newPurchase = new Purchase({
      ...purchase,
      supplier: purchase.supplier ? purchase.supplier._id : undefined,
      shop: purchase.shop ? purchase.shop._id : undefined,
      added_by: purchase.added_by ? purchase.added_by._id : undefined
    });
    newPurchase
      .save()
      .then((p) => {
        console.log(p, '-------purchse after save');
        Purchase.findById(p._id)
          .populate('supplier')
          .populate('shop')
          .populate('added_by')
          .populate('items.product')
          .then((result) => resolve(result))
          .catch((e) => res.status(500).json(responseData));
      })
      .catch((err) => res.status(500).json(responseData));
  });

  const saveTransfer = new Promise((resolve, reject) => {
    let newTransfer = new Transfer({
      // date: ,
      from: {
        supplier: purchase.supplier
      },
      to: {
        shop: purchase.shop
      },
      status: {},
      total_amount: purchase.total_amount,
      items: purchase.items
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
    let items = purchase.items;
    console.log(items, '--------------purchase.items in changeShop');
    let stocks = [];
    if (items.length === 0) {
      resolve([]);
    } else {
      items.forEach(async (item) => {
        let stock = await Stock.findOne({
          shop: purchase.shop,
          product: item.product
        });
        console.log(stock, '--------stock after findone');
        if (stock) {
          console.log('-----update');
          stock.quantity += item.amount;
          if (item.purchase_price && item.purchase_price !== 0)
            stock.purchase_price = item.purchase_price;
          if (item.regular_price && item.regular_price !== 0)
            stock.regular_price = item.regular_price;
          if (item.sale_price && item.sale_price !== 0)
            stock.sale_price = item.sale_price;
          stock = await stock.save();
          console.log(stock, '--------stock after update');
          resolve(stock);
        } else {
          console.log('-----add');
          stock = new Stock({
            ...item,
            shop: purchase.shop,
            quantity: item.amount
          });
          stock = await stock.save();
          console.log(stock, '-------stock after add');
          resolve(stock);
        }
        //find by shop and product
        // Stock.findOne({ shop: purchase.shop, product: item.product }).then(
        //   (stock) => {
        //     if (stock) {
        //       //update stock
        //       stock;
        //     } else {
        //       //add stock
        //     }
        //   }
        // );
      });
      resolve(stocks);
    }
  });

  Promise.all([savePurchase, saveTransfer, changeShop]).then((values) => {
    console.log(values);
    responseData.success = true;
    responseData.data = values[0];
    return res.json(responseData);
  });
});

purchaseRoutes.post('/api/purchase', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  Purchase.findByIdAndUpdate(req.body.purchase._id, {
    ...req.body.purchase,
    supplier: req.body.purchase.supplier
      ? req.body.purchase.supplier._id
      : undefined,
    shop: req.body.purchase.shop ? req.body.purchase.shop._id : undefined
  })
    .then((doc) => {
      if (doc) {
        Purchase.findById(doc._id)
          .populate('supplier')
          .populate('shop')
          .populate('added_by')
          .populate('items.product')
          .then((purchase) => {
            responseData.success = true;
            responseData.data = purchase;
            return res.json(responseData);
          })
          .catch((ee) => res.status(500).json(responseData));
      }
    })
    .catch((err) => res.status(500).json(responseData));
});

purchaseRoutes.get('/api/purchase/:purchaseId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.purchaseId) {
    Purchase.find({ _id: req.params.purchaseId })
      .then((purchase) => {
        responseData.success = true;
        responseData.data = purchase;
        return res.json(responseData);
      })
      .catch((err) => res.status(500).json(responseData));
  } else {
    res.json(responseData);
  }
});

purchaseRoutes.delete('/api/purchase/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  Purchase.findByIdAndRemove(req.params.id, req.body)
    .then((purchase) => {
      responseData.success = true;
      responseData.data = purchase;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = purchaseRoutes;
