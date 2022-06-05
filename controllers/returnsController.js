const Joi = require('joi');
const moment = require('moment');
const Rental = require('../models/rentalModel');
const Returns = require('../models/returnsModel');
exports.createReturns = async (req, res) => {
  try {
    const schema = Joi.object({
      customerId: Joi.required(),
      movieId: Joi.required(),
    });
    const { error } = schema.validate(req.body);
    if (error) throw error;
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if (!rental) {
      return res.status(404).send('No rental is found for this customer and movie');
    }
    if (rental.dateReturned) {
      return res.status(400).send('The rental is already processed');
    }
    const currentTime = moment().toDate();
    const rentalFee = moment(currentTime).diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate;
    const newReturn = new Returns({
      customerId: req.body.customerId,
      movieId: req.body.movieId,
      dateReturned: currentTime,
      rentalFee,
    });
    rental.dateReturned = currentTime;
    rental.rentalFee = rentalFee;
    rental.movie.numberInStock++;
    await newReturn.save();
    await rental.save();
    res.status(201).send(newReturn);
  } catch (err) {
    res.status(400).send(err.message);
  }
};
