'use strict';
const mongoose = require('mongoose');
const Stock = require('./stock');
const Store = require('./store');
const Shop = require('./shop');
const Product = require('./product');
const User = require('./user');
const Customer = require('./customer');

let RecepitSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Customer
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Shop
  },
  items: [
    {
      stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Stock
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
      amount: { type: Number, default: 0 },
      quantity: { type: Number, default: 0 },
      unit_price: { type: Number, default: 0 },
      discount: { type: Number, default: 0 }
    }
  ],
  total_amount: { type: Number, default: 0 },
  paid_amount: { type: Number, default: 0 },
  sell_due: { type: Number, default: 0 },
  sell_return_due: { type: Number, default: 0 },
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

let Recepit = mongoose.model('recepits', RecepitSchema);

module.exports = Recepit;
