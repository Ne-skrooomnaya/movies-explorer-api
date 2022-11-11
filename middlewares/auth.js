const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const ErrorUnauthorized = require('../utils/ErrorUnauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorUnauthorized('Ошибка при авторизации'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    next(new ErrorUnauthorized('Ошибка при авторизации'));
  }

  req.user = payload;
  next();
};
