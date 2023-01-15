const rateLimit = require('express-rate-limit');
const ErrorManyRequests = require('../utils/ErrorManyRequests');
const {
  errorLimit,
} = require('../config/erors');

module.exports = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 5 requests per windowMs
  handler: (req, res, next) => next(new ErrorManyRequests(errorLimit)),

});
