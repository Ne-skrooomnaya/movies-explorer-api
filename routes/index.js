const router = require('express').Router();
const auth = require('../middlewares/auth');
const UserRoutes = require('./users');
const MovieRoutes = require('./movies');
const { authValidation, registerValidation } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
// const UnauthorizedError = require('../errors/unauthorizedError');
// const { neededAutorisation } = require('../utils/errorMessage');
const { ErrorNot } = require('../utils/ErrorNot');

router.post('/signin', authValidation, login);
router.post('/signup', registerValidation, createUser);

router.use(auth);
router.use('/users', UserRoutes);
router.use('/movies', MovieRoutes);
router.use('/', (req, res, next) => {
  next(new ErrorNot('Страница не найдена 5'));
});

module.exports = router;
