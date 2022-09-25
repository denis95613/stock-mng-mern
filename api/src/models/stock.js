'use strict';
const mongoose = require('mongoose');
const Shop = require('./shop');
const Store = require('./store');
const User = require('./user');
const Invoice = require('./invoice');
const Product = require('./product');

let StockSchema = mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Shop
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Store
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product
  },
  skucode: String,
  quantity: { type: Number, default: 0 },
  limit_quantity: { type: Number, default: 0 },
  purchase_price: { type: Number, default: 0 },
  regular_price: { type: Number, default: 0 },
  sale_price: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

let Stock = mongoose.model('stocks', StockSchema);

module.exports = Stock;
