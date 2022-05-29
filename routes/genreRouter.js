const express = require('express');
const genreRouter = express.Router();

const { getAllGenres, getGenre, createGenre, updateGenre, deleteGenre } = require('../controllers/genreController');

const protect = require('../middleware/protect');
const validateObjectId = require('../middleware/validateObjectId');
genreRouter.route('/').get(getAllGenres).post(protect, createGenre);
genreRouter.route('/:id').get(validateObjectId, getGenre).put(updateGenre).delete(deleteGenre);

module.exports = genreRouter;
