// src / server.js
'use strict';

// Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const config = require('./config');
let commonRoutes = require('./routes');
let userRoutes = require('./routes/user');
let roleRoutes = require('./routes/role');
let supplierRoutes = require('./routes/supplier');
let customerRoutes = require('./routes/customer');
let shopRoutes = require('./routes/shop');
let storeRoutes = require('./routes/store');
let categoryRoutes = require('./routes/category');
let productRoutes = require('./routes/product');
let purchaseRoutes = require('./routes/purchase');
let sellRoutes = require('./routes/sell');
let stockRoutes = require('./routes/stock');
let recepitRoutes = require('./routes/recepit');
let transferRoutes = require('./routes/transfer');
let notificationRoutes = require('./routes/notification');
let fileRoutes = require('./routes/file');

// Setup
let apiServer = express();
apiServer.set('APP_SECRET', config.secret);

// MongoDB (mongoose)
mongoose.connect(config.databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

apiServer.use(cors());

apiServer.use(express.json());
apiServer.use(express.urlencoded({ extended: true }));

// Body Parser
// apiServer.use(bodyParser.urlencoded({ extended: true }));
// apiServer.use(bodyParser.json());

// apiServer.use(express.static(path.join(__dirname, '../build')));
// apiServer.get('/*', function (request, response) {
//   response.sendFile(path.join(__dirname, '../build/', 'index.html'));
// });

// Cookie Parser
apiServer.use(cookieParser());

// Routes
apiServer.use(commonRoutes);
apiServer.use(userRoutes);
apiServer.use(roleRoutes);
apiServer.use(supplierRoutes);
apiServer.use(customerRoutes);
apiServer.use(shopRoutes);
apiServer.use(storeRoutes);
apiServer.use(categoryRoutes);
apiServer.use(productRoutes);
apiServer.use(purchaseRoutes);
apiServer.use(sellRoutes);
apiServer.use(stockRoutes);
apiServer.use(recepitRoutes);
apiServer.use(transferRoutes);
apiServer.use(notificationRoutes);
apiServer.use(fileRoutes);

// Export
module.exports = apiServer;
