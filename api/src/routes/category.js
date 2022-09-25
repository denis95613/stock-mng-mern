'use strict';
const express = require('express');
const isEmpty = require('lodash/isEmpty');

const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Category = require('../models/category');
const { ContactlessOutlined } = require('@mui/icons-material');

let categoryRoutes = express.Router();

// Route --------- GET api/categories
// Description --- Get all categories
categoryRoutes.get('/api/category', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: []
  };

  Category.find()
    .populate('children.category')
    .then((categories) => {
      console.log('---------categories', categories);
      responseData.success = true;
      responseData.data = categories;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

categoryRoutes.post('/api/category/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  console.log(req.body.category, '-----category add in server');
  let newCategory = new Category(req.body.category);
  newCategory._ids = [newCategory._id];
  console.log(newCategory, '----newCateory add in server');
  Category.create(newCategory)
    .then((category) => {
      responseData.success = true;
      responseData.data = category;
      return res.json(responseData);
    })
    .catch((err) => res.status(400).json(responseData));
});

categoryRoutes.post('/api/category', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  let { category } = req.body;
  console.log(category, '------category in update servr');
  let newCategory = new Category(category.child);
  newCategory._ids = [...category._ids, newCategory._id];
  category = { ...category, children: [...category.children, newCategory] };
  console.log(category, '----before update');
  Category.findByIdAndUpdate(category._id, category)
    .then((doc) => {
      if (doc) {
        Category.findById(doc._id)
          .then((category) => {
            responseData.success = true;
            responseData.data = category;
            return res.json(responseData);
          })
          .catch((e) => res.status(400).json(responseData));
      }
    })
    .catch((err) => res.status(400).json(responseData));
});

categoryRoutes.get('/api/category/:categoryId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.categoryId) {
    Category.find({ _id: req.params.categoryId })
      .then((category) => {
        responseData.success = true;
        responseData.data = category;
        return res.json(responseData);
      })
      .catch((err) => res.status(400).json(responseData));
  } else {
    res.json(responseData);
  }
});

categoryRoutes.delete('/api/category/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  Category.findByIdAndRemove(req.params.id, req.body)
    .then((category) => {
      responseData.success = true;
      responseData.data = category;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = categoryRoutes;
