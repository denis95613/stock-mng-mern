'use strict';
const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let Purchase = require('../models/purchase');
let Transfer = require('../models/transfer');
let Stock = require('../models/stock');
let User = require('../models/user');
let Supplier = require('../models/supplier');

let fileRoutes = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './src/uploads');
      // cb(null, __dirname);
      // cb(null, path.join(__dirname, '..', '/uploads'));
      // cb(null, path.join(__dirname, '../uploads/'));
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 1000000 // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
        )
      );
    }
    cb(undefined, true); // continue with upload
  }
});

fileRoutes.post(
  '/api/file/upload',
  authMiddleware,
  upload.single('file'),
  async (req, res) => {
    let responseData = {
      success: false,
      data: [],
      errors: []
    };

    console.log(req.body, '---req.body');
    console.log(req.files, '---req.files');

    return res.status(200).json(responseData);
  }
);

module.exports = fileRoutes;
