'use strict';
const mongoose = require('mongoose');
const Customer = require('./customer');
const User = require('./user');
const Shop = require('./shop');
const Invoice = require('./invoice');
const Product = require('./product');
const Stock = require('./stock');

let SellSchema = mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Invoice
  },
  contact: String,
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Shop
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Customer
  },
  payment_status: {
    value: { type: Number },
    label: { type: String }
  },
  payment_method: { value: { type: Number }, label: { type: String } },
  total_amount: { type: Number, default: 0 },
  paid_amount: { type: Number, default: 0 },
  sell_due: { type: Number, default: 0 },
  sell_return_due: { type: Number, default: 0 },
  shipping_status: { type: Number, default: 0 },
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  },
  items: [
    {
      stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Stock
      },
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
  sell_note: String,
  stuf_note: String,
  shipping_note: String,
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

let Sell = mongoose.model('sells', SellSchema);

module.exports = Sell;
