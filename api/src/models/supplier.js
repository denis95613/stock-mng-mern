'use strict';

const mongoose = require('mongoose');

let SupplierSchema = mongoose.Schema({
  contact_id: String,
  bus_name: String,
  name: String,
  email: String,
  tax_num: String,
  pay_term: { type: Number, default: 0 },
  opening_balance: { type: Number, default: 0 },
  advance_balance: { type: Number, default: 0 },
  added_on: { type: Date, default: Date.now },
  address: String,
  mobile: String,
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

let Supplier = mongoose.model('suppliers', SupplierSchema);

module.exports = Supplier;
