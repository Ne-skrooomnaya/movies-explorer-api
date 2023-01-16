const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const ErrorHandler = require('./middlewares/ErrorHandler');
const apiLimiter = require('./middlewares/apiLimiter');

const { PORT = 3000 } = process.env;
const { NODE_ENV, DB_ADRESS } = process.env;

const app = express();

app.use(
  cors(),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? DB_ADRESS : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
}).then(() => console.log('connected'))
  .catch((err) => console.log(`Ошибка ${err.name}: ${err.message}`));
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.use(requestLogger);
app.use(apiLimiter);
app.use(helmet());

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
