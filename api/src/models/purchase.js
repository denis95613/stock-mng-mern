'use strict';

const mongoose = require('mongoose');
const Supplier = require('./supplier');
const Shop = require('./shop');
const User = require('./user');
const Product = require('./product');

let PurchaseSchema = mongoose.Schema({
  reference_no: String,
  location: String,
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Supplier
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Shop
  },
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  },
  // purchase_status: { type: Number, default: 0 },
  // payment_status: { type: Number, default: 0 },
  purchase_status: {
    value: { type: Number },
    label: { type: String }
  },
  payment_status: {
    value: { type: Number },
    label: { type: String }
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product
      },
      amount: { type: Number, default: 0 },
      purchase_price: { type: Number, default: 0 },
      regular_price: { type: Number, default: 0 },
      sale_price: { type: Number, default: 0 }
    }
  ],
  total_amount: { type: Number, default: 0 },
  paid_amount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

let Purchase = mongoose.model('purchases', PurchaseSchema);

module.exports = Purchase;
