const Joi = require('joi');
const Fawn = require('fawn');
const Rental = require('../models/rentalModel');
const Customer = require('../models/customerModel');
const Movie = require('../models/movieModel');

Fawn.init('mongodb://localhost:27017/vidly');
//HTTP verbs request

exports.getAllRentals = async (req, res) => {
  const rentals = await Rental.find();
  res.status(200).send(rentals);
};

exports.getRental = async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) {
    return res.status(404).send('The rental with given ID was not found');
  }
  res.status(200).send(rental);
};

exports.createRental = async (req, res) => {
  try {
    const schema = Joi.object({
      customerId: Joi.string().required(),
      movieId: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw error;
    }

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) {
      throw new Error('The customer with given ID was not found');
    }
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) {
      throw new Error('The movie with given ID was not found');
    }
    if (movie.numberInStock === 0) {
      return res.status(400).send('Movie is not in stock');
    }
    let rental = new Rental({
      customer: {
        isGold: customer.isGold,
        username: customer.username,
        phone: customer.phone,
        _id: customer._id,
      },
      movie: {
        title: movie.title,
        genre: {
          name: movie.genre.name,
          _id: movie.genre._id,
        },
        dailyRentalRate: movie.dailyRentalRate,
        _id: movie._id,
      },
    });

    Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run()
      .catch((err) => {
        throw err;
      });
    // rental = await rental.save();
    res.status(201).send(rental);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateRental = async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) {
    return res.status(404).send('The rental with given ID was not found');
  }
  try {
    const schema = Joi.object({
      customerId: Joi.string(),
      movieId: Joi.string(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw error;
    }
    rental.set(req.body);
    const updatedRental = await rental.save();
    res.status(200).send(updatedRental);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

exports.deleteRental = async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);
  if (!rental) {
    return res.status(404).send('The rental with given ID was not found');
  }
  res.status(204).send({ status: 'success', data: null });
};
