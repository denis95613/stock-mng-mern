'use strict';
const express = require('express');
const isEmpty = require('lodash/isEmpty');
const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Notification = require('../models/notification');

let notificationRoutes = express.Router();

// Route --------- GET api/categories
// Description --- Get all categories
notificationRoutes.get('/api/notification', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };

  Notification.find()
    .then((notes) => {
      responseData.success = true;
      responseData.data = notes;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

notificationRoutes.post('/api/notification/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Notification.create(req.body.notification)
    .then((note) => {
      responseData.success = true;
      responseData.data = note;
      return res.json(responseData);
    })
    .catch((err) => res.status(400).json(responseData));
});

notificationRoutes.post('/api/notification', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Notification.findByIdAndUpdate(req.body.notification._id, req.body.notification)
    .then((doc) => {
      if (doc) {
        Notification.findById(doc._id)
          .then((note) => {
            responseData.success = true;
            responseData.data = note;
            return res.json(responseData);
          })
          .catch((e) => res.status(400).json(responseData));
      }
    })
    .catch((err) => res.status(400).json(responseData));
});

notificationRoutes.get('/api/notification/:notificationId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.notificationId) {
    Notification.find({ _id: req.params.notificationId })
      .then((note) => {
        responseData.success = true;
        responseData.data = note;
        return res.json(responseData);
      })
      .catch((err) => res.status(400).json(responseData));
  } else {
    res.json(responseData);
  }
});

notificationRoutes.delete('/api/notification/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Notification.findByIdAndRemove(req.params.id, req.body)
    .then((note) => {
      responseData.success = true;
      responseData.data = note;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = notificationRoutes;
