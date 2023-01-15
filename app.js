require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
// const cors = require('cors');
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const ErrorHandler = require('./middlewares/ErrorHandler');
const apiLimiter = require('./middlewares/apiLimiter');

const { PORT = 3002, DB_ADRESS = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();

app.use(cors);
app.use(requestLogger);
app.use(apiLimiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_ADRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('connected'))
  .catch((err) => console.log(`Ошибка ${err.name}: ${err.message}`));
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
