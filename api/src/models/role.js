'use strict';

const mongoose = require('mongoose');

let RoleSchema = mongoose.Schema({
  name: String,
  description: String,
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

let Role = mongoose.model('roles', RoleSchema);

module.exports = Role;
