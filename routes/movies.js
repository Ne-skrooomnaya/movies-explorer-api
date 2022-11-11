const express = require('express');

const MovieRoutes = express.Router();

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const {
  movieValidation, movieIdValidation,
} = require('../middlewares/validation');

MovieRoutes.post('/', movieValidation, createMovie);
MovieRoutes.get('/', getMovies);
MovieRoutes.delete('/:movieId', movieIdValidation, deleteMovie);

module.exports = MovieRoutes;
