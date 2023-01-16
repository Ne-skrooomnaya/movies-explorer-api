require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const ErrorHandler = require('./middlewares/ErrorHandler');
const apiLimiter = require('./middlewares/apiLimiter');

const { PORT = 3002 } = process.env;
const { NODE_ENV, DB_ADRESS } = process.env;

const app = express();

app.use(
  cors({
    origin: ['https://api.nomoreparties.co', 'http://localhost:3000', 'http://localhost:3002', 'https://angelDiplomnaya.nomoredomains.club', 'https://api.angelDiplomnaya.nomoredomains.club'], // было 3002
    credentials: true,
  }),
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
