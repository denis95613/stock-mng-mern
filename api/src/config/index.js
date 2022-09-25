'use strict';

const config = {
  port: 5000,
  secret: 'super-secret-key',
  databaseUrl: 'mongodb://localhost:27017/stock',
  saltRounds: 10
};

module.exports = config;
