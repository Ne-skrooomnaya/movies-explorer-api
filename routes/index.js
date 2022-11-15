const router = require('express').Router();
const auth = require('../middlewares/auth');
const UserRoutes = require('./users');
const MovieRoutes = require('./movies');
const { authValidation, registerValidation } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
const { ErrorNot } = require('../utils/ErrorNot');
const { errorNotFound } = require('../config/erors');

router.post('/signin', authValidation, login);
router.post('/signup', registerValidation, createUser);

router.use(auth);
router.use('/users', UserRoutes);
router.use('/movies', MovieRoutes);
router.use('/', (req, res, next) => {
  next(new ErrorNot(errorNotFound));
});

module.exports = router;
