const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const ErrorUnauthorized = require('../utils/ErrorUnauthorized');
const {
  errorEmail,
  userEmailPas,
} = require('../config/erors');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true],
    minlength: [2],
    maxlength: [30],
    // default: 'Кинолюбитель',
  },
  email: {
    type: String,
    required: [true],
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: errorEmail,
    },
  },
  password: {
    type: String,
    required: [true],
    select: false,
    // minlenght: 8,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrorUnauthorized(userEmailPas));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new ErrorUnauthorized(userEmailPas));
        }
        return user;
      });
    });
};

userSchema.set('toJSON', {
  transform(doc, res) {
    delete res.password;
    return res;
  },
});

module.exports = mongoose.model('user', userSchema);
