const Joi = require('joi');
const Genre = require('../models/genreModel');
const Movie = require('../models/movieModel');

// HTTP verbs request

exports.getAllMovies = async (req, res) => {
  const movies = await Movie.find();
  res.status(200).send(movies);
};

exports.getMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).send('The movie with given ID was not found');
  }
  res.status(200).send(movie);
};

exports.createMovie = async (req, res) => {
  try {
    const schema = Joi.object({
      title: Joi.string().min(1).max(50).required(),
      genreId: Joi.string().required(),
      numberInStock: Joi.number().required(),
      dailyRentalRate: Joi.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw error;
    }
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
      throw Error('The genre with given ID was not found');
    }
    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    const newMovie = await movie.save();
    res.status(201).send(newMovie);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateMovie = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(404).send('The movie with given ID was not found');
  }
  movie.set(req.body);
  const updatedMovie = await movie.save();
  res.status(200).send(updatedMovie);
};

exports.deleteMovie = async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) {
    res.status(404).send('The movie with given ID was not found');
  }
  res.status(204).send({ status: 'success', data: null });
};
