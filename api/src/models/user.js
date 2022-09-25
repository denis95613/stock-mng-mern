'use strict';

const mongoose = require('mongoose');
const Role = require('./role');

let UserSchema = mongoose.Schema({
  name: String,
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Role
  },
  photo_url: String,
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

let User = mongoose.model('users', UserSchema);

module.exports = User;
