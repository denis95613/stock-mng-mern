'use strict';
const mongoose = require('mongoose');

let CategorySchema = mongoose.Schema({
  parent: String,
  name: String,
  description: String,
  _ids: { type: Array, default: [] },
  children: {
    type: [this]
  },
  // children: {
  //   type: [
  //     {
  //       type: mongoose.Types.ObjectId,
  //       ref: 'categories'
  //     }
  //   ]
  // },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

let Category = mongoose.model('categories', CategorySchema);

module.exports = Category;
