const express = require('express');
const genreRouter = express.Router();

const {
  getAllGenres,
  getGenre,
  createGenre,
  updateGenre,
  deleteGenre,
} = require('../controllers/genreController');
genreRouter.route('/').get(getAllGenres).post(createGenre);
genreRouter.route('/:id').get(getGenre).put(updateGenre).delete(deleteGenre);

module.exports = genreRouter;
