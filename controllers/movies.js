const Movie = require('../models/Movie');

const { ErrorBad } = require('../utils/ErrorBad');
const { ErrorForbidden } = require('../utils/ErrorForbidden');
const { ErrorNot } = require('../utils/ErrorNot');
const { ErrorServer } = require('../utils/ErrorServer');

const {
  movieDel, movieCannotDelete, movieNotFound, errorValidation, errorServer,
} = require('../config/erors');

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
        next(new ErrorBad(errorValidation));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        return next(new ErrorNot(movieNotFound));
      }
      if (req.user._id !== movie.owner.toString()) {
        return next(new ErrorForbidden(movieCannotDelete));
      }
      return Movie.findByIdAndRemove(req.params.movieId)
        .then(() => res.status(200).send({ message: movieDel }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorBad(errorValidation));
      }
      return next(new ErrorServer(errorServer));
    });
};

module.exports = {
  getMovies,
  deleteMovie,
  createMovie,
};
