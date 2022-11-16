const jwt = require('jsonwebtoken');

const { ErrorUnauth } = require('../utils/ErrorUnauth');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorUnauth('Ошибка при авторизации');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(ErrorUnauth('Ошибка при авторизации'));
    }
    return next(err);
  }
  req.user = payload;
  return next();
};

module.exports = auth;
