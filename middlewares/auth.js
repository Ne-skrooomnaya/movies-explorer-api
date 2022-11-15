const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const ErrorUnauthorized = require('../utils/ErrorUnauthorized');

const {
  errorAuth,
} = require('../config/erors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorUnauthorized(errorAuth));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    next(new ErrorUnauthorized(errorAuth));
  }

  req.user = payload;
  next();
};
