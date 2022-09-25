'use strict';

const mongoose = require('mongoose');

let ShopSchema = mongoose.Schema({
  contact_id: String,
  name: String,
  added_on: { type: Date, default: Date.now },
  mobile: String,
  location: String,
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

let Shop = mongoose.model('shops', ShopSchema);

module.exports = Shop;
