'use strict';

const express = require('express');
const isEmpty = require('lodash/isEmpty');

const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Role = require('../models/role');

let roleRoutes = express.Router();

// Route --------- GET api/roles
// Description --- Get all roles
roleRoutes.get('/api/role', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };
  Role.find()
    .then((roles) => {
      responseData.success = true;
      responseData.data = roles;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

roleRoutes.post('/api/role/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Role.create(req.body.role)
    .then((role) => {
      responseData.success = true;
      responseData.data = role;
      return res.json(responseData);
    })
    .catch((err) => res.status(400).json(responseData));
});

roleRoutes.post('/api/role', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Role.findByIdAndUpdate(req.body.role._id, req.body.role)
    .then((doc) => {
      if (doc) {
        Role.findById(doc._id)
          .then((role) => {
            responseData.success = true;
            responseData.data = role;
            return res.json(responseData);
          })
          .catch((e) => res.status(400).json(responseData));
      }
    })
    .catch((err) => res.status(400).json(responseData));
});

roleRoutes.get('/api/role/:roleId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.roleId) {
    Role.find({ _id: req.params.roleId })
      .then((role) => {
        responseData.success = true;
        responseData.data = role;
        return res.json(responseData);
      })
      .catch((err) => res.status(400).json(responseData));
  } else {
    res.json(responseData);
  }
});

roleRoutes.delete('/api/role/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Role.findByIdAndRemove(req.params.id, req.body)
    .then((role) => {
      responseData.success = true;
      responseData.data = role;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = roleRoutes;
