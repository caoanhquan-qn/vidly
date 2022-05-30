const Joi = require('joi');
const Genre = require('../models/genreModel');

// HTTP verb requests
exports.getAllGenres = async (req, res) => {
  const genres = await Genre.find();
  res.status(200).send(genres);
};

exports.getGenre = async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    return res.status(404).send('The genre with given ID was not found');
  }
  res.status(200).send(genre);
};

exports.createGenre = async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(3).max(25).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw error;
    }
    const genre = new Genre({
      name: req.body.name,
    });
    const newGenre = await genre.save();
    res.status(201).send(newGenre);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateGenre = async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    return res.status(404).send('The genre with given ID was not found');
  }
  try {
    const schema = Joi.object({
      name: Joi.string().min(3).max(25).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw error;
    }
    genre.set(req.body);
    const updatedGenre = await genre.save();
    res.status(200).send(updatedGenre);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteGenre = async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) {
    return res.status(404).send('The genre with given ID was not found');
  }
  res.status(204).json({ status: 'success', data: null });
};
