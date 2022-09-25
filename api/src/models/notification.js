'use strict';

const mongoose = require('mongoose');

let NotificationSchema = mongoose.Schema({
  title: String,
  content: String,
  isRead: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

let Notification = mongoose.model('notifications', NotificationSchema);

module.exports = Notification;
