const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();

const { ErrorBad } = require('../utils/ErrorBad');
const { ErrorConflict } = require('../utils/ErrorConflict');
const { ErrorNot } = require('../utils/ErrorNot');
const { ErrorServer } = require('../utils/ErrorServer');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name,
    email,
    password: hash,
  })).then(() => {
    res.status(200).send({
      data: {
        name, email,
      },
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      next(new ErrorBad('Переданы невалидные данные'));
    } if (err.code === 11000) {
      next(new ErrorConflict('Пользователь с таким email уже зарегистрирован 5'));
    } else {
      next(new ErrorServer('Ошибка на сервере'));
    }
  });
};

const getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId).then((user) => {
    if (!user) {
      next(new ErrorNot('Указанный пользователь не найден'));
    }
    res.send(user);
  }).catch((err) => {
    if (err.name === 'CastError') {
      next(new ErrorBad('Переданы невалидные данные'));
    } else {
      next(new ErrorServer('Ошибка на сервере'));
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
      if (!user) {
        next(new ErrorNot('Такого пользователя не существует 1'));
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBad('Ошибка валидации'));
      } if (err.code === 11000) {
        next(new ErrorServer('Ошибка на сервере'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new ErrorNot('Такого пользователя не существует 1'));
      }
      res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  login,
  updateUserInfo,
  getUserInfo,
};
