const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ErrorBad } = require('../utils/ErrorBad');
const { ErrorConflict } = require('../utils/ErrorConflict');
const { ErrorNot } = require('../utils/ErrorNot');
const { ErrorServer } = require('../utils/ErrorServer');
const {
  errorValidation, errorServer, userEmailError, userNotFound,
} = require('../config/erors');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name, email, password: hash,
  })).then(() => {
    res.status(200).send({
      data: {
        name, email,
      },
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      next(new ErrorBad(errorValidation));
    } if (err.code === 11000) {
      next(new ErrorConflict(userEmailError));
    }
    next(err);
  });
};

const getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId).then((user) => {
    if (!user) {
      next(new ErrorNot(userNotFound));
    }
    res.send(user);
  }).catch((err) => {
    if (err.name === 'CastError') {
      next(new ErrorBad(errorValidation));
    } else {
      next(new ErrorServer(errorServer));
    }
  });
};

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.status(200).send({ user });
        return;
      }
      next(new ErrorNot(userNotFound));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBad(errorValidation));
        return;
      }
      if (err.code === 11000) {
        next(new ErrorConflict(userEmailError));
        return;
      }
      if (err.name === 'CastError') {
        next(new ErrorBad(errorValidation));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(200).send({ user });
        return;
      }
      next(new ErrorNot(userNotFound));
    })
    .catch(next);
};

module.exports = {
  getUserId,
  createUser,
  login,
  updateUserInfo,
  getUserInfo,
};
