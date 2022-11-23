const express = require('express');

const UserRoutes = express.Router();

const {
  userValidation,
} = require('../middlewares/validation');

const {
  getUserInfo, updateUserInfo,
} = require('../controllers/users');

UserRoutes.get('/me', express.json(), getUserInfo);
UserRoutes.patch('/me', express.json(), userValidation, updateUserInfo);

module.exports = UserRoutes;
