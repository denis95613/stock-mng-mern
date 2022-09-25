'use strict';

const mongoose = require('mongoose');

let InvoiceSchema = mongoose.Schema({
  no: String,
  description: String,
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

let Invoice = mongoose.model('invoices', InvoiceSchema);

module.exports = Invoice;
