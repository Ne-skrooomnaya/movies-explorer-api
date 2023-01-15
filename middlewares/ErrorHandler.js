const ErrorHandler = ((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Ошибка на сервере666' : err.message;
  res.status(statusCode).send({ message });
  next();
});

module.exports = ErrorHandler;
