'use strict';

const mongoose = require('mongoose');
const Category = require('./category');
const Shop = require('./shop');
const Store = require('./store');

let ProductSchema = mongoose.Schema({
  name: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Category
  },
  // shop: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: Shop
  // },
  // store: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: Store
  // },
  description: String,
  product_tags: Array,
  purchase_price: { type: Number, default: 0 },
  regular_price: { type: Number, default: 0 },
  sale_price: { type: Number, default: 0 },
  sku_code: String,
  quantity: { type: Number, default: 0 },
  low_count: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  length: { type: Number, defult: 0 },
  width: { type: Number, default: 0 },
  shipping_class: String,
  image_url: String,
  tax_status: String,
  tax_class: String,
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

let Product = mongoose.model('products', ProductSchema);

module.exports = Product;
