const express = require('express');
const movieRouter = express.Router();

const {
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController.js');
movieRouter.route('/').get(getAllMovies).post(createMovie);
movieRouter.route('/:id').get(getMovie).put(updateMovie).delete(deleteMovie);

module.exports = movieRouter;
