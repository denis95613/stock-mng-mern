'use strict';

const mongoose = require('mongoose');
const Shop = require('./shop');
const Store = require('./store');
const Supplier = require('./supplier');
const Customer = require('./customer');
const Stock = require('./stock');
const Product = require('./product');

let TransferSchema = mongoose.Schema({
  reference_no: String,
  date: { type: Date, default: Date.now },
  from: {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Shop
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Store
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Supplier
    }
  },
  to: {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Shop
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Store
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Customer
    }
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
  status: {
    value: Number,
    label: String
  },
  shipping_charge: { type: Number, default: 0 },
  total_amount: { type: Number, default: 0 },
  note: String,
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

let Transfer = mongoose.model('transfers', TransferSchema);

module.exports = Transfer;
