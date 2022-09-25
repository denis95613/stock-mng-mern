'use strict';
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const config = require('./../config');
let authMiddleware = require('./middlewares/auth');
let User = require('../models/user');

let userRoutes = express.Router();

userRoutes.post('/api/user/login', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: {}
  };
  if (req.body.email) {
    User.findOne({ email: req.body.email }, (error, user) => {
      if (error) {
        // responseData.errors.push({ type: 'critical', message: error });
        responseData.errors = {
          ...responseData.errors,
          email: error,
          password: error
        };

        res.json(responseData);
      } else {
        if (!user) {
          responseData.errors = {
            ...responseData.errors,
            email: 'No user exists with this email.'
          };
          res.json(responseData);
        } else {
          bcrypt.compare(
            req.body.password,
            user.password,
            function (hashError, hashPasswordCheck) {
              if (!hashError) {
                if (hashPasswordCheck) {
                  responseData = {
                    user,
                    accessToken: jwt.sign({ user }, config.secret),
                    success: true
                  };
                  console.log(responseData);
                } else {
                  // responseData.errors.push({
                  //   type: 'critical',
                  //   message: 'The password is incorrect.'
                  // });
                  responseData.errors = {
                    ...responseData.errors,
                    password: 'The password is incorrect.'
                  };
                }
                res.json(responseData);
              } else {
                // responseData.errors.push({
                //   type: 'critical',
                //   message: 'Please try again.'
                // });
                responseData.errors = {
                  ...responseData.errors,
                  email: 'Please try again.',
                  password: 'Please try again.'
                };
                res.json(responseData);
              }
            }
          );
        }
      }
    });
  } else {
    // responseData.errors.push({
    //   type: 'critical',
    //   message: 'Username not provided.'
    // });
    responseData.errors = {
      ...responseData.errors,
      email: error
    };

    res.json(responseData);
  }
});

userRoutes.post('/api/user/register', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: {}
  };

  if (req.body.email != '') {
    // Check user exists
    User.findOne({ email: req.body.email }, (error, document) => {
      if (!document) {
        // User does not exists
        // Hash password
        bcrypt.hash(
          req.body.password,
          config.saltRounds,
          function (hashError, hashPassword) {
            if (!hashError) {
              // Define new user
              let user = {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                createdAt: new Date()
              };
              // Save into database
              User.create(user, function (errorCreate, documentCreate) {
                let userId = documentCreate._id;
                if (userId) {
                  responseData = {
                    success: true,
                    user: documentCreate,
                    accessToken: jwt.sign({ user }, config.secret)
                  };
                  console.log(responseData);
                } else {
                  // responseData.errors.push({
                  //   type: 'default',
                  //   message: 'Please try again.'
                  // });
                  responseData.errors = {
                    ...responseData.errors,
                    name: 'Please try again.',
                    email: 'Please try again.',
                    password: 'Please try again.'
                  };
                }
                res.json(responseData);
              });
            } else {
              // responseData.errors.push({
              //   type: 'default',
              //   message: 'Please try again.'
              // });
              responseData.errors = {
                ...responseData.errors,
                name: 'Please try again.',
                email: 'Please try again.',
                password: 'Please try again.'
              };
            }
          }
        );
      } else {
        // User already exists
        // responseData.errors.push({
        //   type: 'warning',
        //   message: 'The username is taken. Please choose something else.'
        // });
        responseData.errors = {
          ...responseData.errors,
          email: 'The email is taken. Please choose something else.'
        };
        res.json(responseData);
      }
    });
  } else {
    // responseData.errors.push({
    //   type: 'critical',
    //   message: 'Username not provided.'
    // });
    responseData.errors = {
      ...responseData.errors,
      email: 'Email not provided.'
    };
    res.json(responseData);
  }
});

// Route --------- GET api/users
// Description --- Get all users
userRoutes.get('/api/user', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: [],
    errors: {}
  };

  User.find()
    .populate('role')
    .then((users) => {
      responseData.success = true;
      responseData.data = users;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

userRoutes.post('/api/user/add', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: {}
  };
  let { user } = req.body;
  if (user.email != '') {
    User.findOne({ email: user.email }, (error, document) => {
      if (!document) {
        bcrypt.hash(
          user.password,
          config.saltRounds,
          function (hashError, hashPassword) {
            if (!hashError) {
              let newUser = new User({
                ...user,
                password: hashPassword
              });
              newUser
                .save()
                .then((u) => {
                  User.findById(u._id)
                    .populate('role')
                    .then((uu) => {
                      responseData.success = true;
                      responseData.data = { ...uu, password: user.password };
                      return res.json(responseData);
                    })
                    .catch((e) => {
                      console.log(e);
                      responseData.errors = {
                        ...responseData.errors,
                        msg: 'Database Error: Please try again.'
                      };
                      return res.status(500).json(responseData);
                    });
                })
                .catch((err) => {
                  console.log(err);
                  responseData.errors = {
                    ...responseData.errors,
                    msg: 'Database Error: Please try again.'
                  };
                  return res.status(500).json(responseData);
                });
            } else {
              responseData.errors = {
                ...responseData.errors,
                msg: 'Please try again.'
              };
            }
          }
        );
      } else {
        responseData.errors = {
          ...responseData.errors,
          email: 'The email is taken. Please choose something else.'
        };
        res.json(responseData);
      }
    });
  } else {
    responseData.errors = {
      ...responseData.errors,
      email: 'Email not provided.'
    };
    res.json(responseData);
  }
});

userRoutes.post('/api/user', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: {}
  };
  let { user } = req.body;
  console.log(user, '-------------user');
  if (user.email != '') {
    User.findOne({ email: user.email }, (error, document) => {
      if (document) {
        bcrypt.hash(
          user.password,
          config.saltRounds,
          function (hashError, hashPassword) {
            if (!hashError) {
              let newUser = {
                ...user,
                password: hashPassword
              };
              User.findByIdAndUpdate(newUser._id, newUser)
                .then((doc) => {
                  if (doc) {
                    User.findById(newUser._id)
                      .populate('role')
                      .then((uuu) => {
                        console.log(responseData.data, uuu, '------before');
                        responseData = {
                          success: true,
                          data: {
                            ...uuu,
                            password: user.password
                          }
                        };
                        console.log(responseData, '------------responseData');
                        return res.json(responseData);
                      })
                      .catch((ee) => {
                        console.log(ee);
                        // responseData.errors = {
                        //   ...responseData.errors,
                        //   msg: 'Server Error: Please try again.'
                        // };
                        // return res.status(500).json(responseData);
                      });
                  }
                })
                .catch(() => {
                  console.log(err);
                  // responseData.errors = {
                  //   ...responseData.errors,
                  //   msg: 'Server Error: Please try again.'
                  // };
                  return res.status(500).json(responseData);
                });
            } else {
              // responseData.errors = {
              //   ...responseData.errors,
              //   msg: 'Hash Error: Please try again.'
              // };
              return res.json(responseData);
            }
          }
        );
      } else {
        // responseData.errors = {
        //   ...responseData.errors,
        //   email: 'The email is not exist. Please try again.'
        // };
        return res.json(responseData);
      }
    });
  } else {
    // responseData.errors = {
    //   ...responseData.errors,
    //   email: 'Email not provided.'
    // };
    return res.json(responseData);
  }
  // User.findByIdAndUpdate(user._id, user)
  //   .then((doc) => {
  //     if (doc) {
  //       User.findById(doc._id)
  //         .then((u) => {
  //           User.findById(u._id)
  //             .populate('role')
  //             .then((user) => {
  //               responseData.success = true;
  //               responseData.data = user;
  //               return res.json(responseData);
  //             })
  //             .catch((ee) => res.status(500).json(responseData));
  //         })
  //         .catch((e) => res.status(500).json(responseData));
  //     }
  //   })
  //   .catch((err) => res.status(500).json(responseData));
});

userRoutes.get('/api/user/:userId', authMiddleware, (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };

  if (req.params.userId) {
    User.find({ _id: req.params.userId })
      .then((user) => {
        responseData.success = true;
        responseData.data = user;
        return res.json(responseData);
      })
      .catch((err) => res.status(400).json(responseData));
  } else {
    res.json(responseData);
  }
});

userRoutes.delete('/api/user/:id', (req, res) => {
  let responseData = {
    success: false,
    data: {},
    errors: []
  };
  User.findByIdAndRemove(req.params.id, req.body)
    .then((user) => {
      responseData.success = true;
      responseData.data = user;
      return res.json(responseData);
    })
    .catch((err) => res.status(404).json(responseData));
});

module.exports = userRoutes;
