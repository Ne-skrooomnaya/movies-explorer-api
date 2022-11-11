const Movie = require('../models/Movie');

const { ErrorBad } = require('../utils/ErrorBad');
const { ErrorForbidden } = require('../utils/ErrorForbidden');
const { ErrorNot } = require('../utils/ErrorNot');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(200).send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBad('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new ErrorNot('Карточка с указанным _id не найдена.'));
      }
      if (movie.owner.toString() !== req.user._id.toString()) {
        next(new ErrorForbidden('Вы не можете удалить чужую карточку'));
      }
      return movie.remove()
        .then(() => res.status(200).send('удалено'));
    })
    .catch(next);
};

module.exports = {
  getMovies,
  deleteMovie,
  createMovie,
};
