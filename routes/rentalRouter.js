const express = require('express');
const rentalRouter = express.Router();

const {
  getAllRentals,
  getRental,
  createRental,
  updateRental,
  deleteRental,
} = require('../controllers/rentalController');

rentalRouter.route('/').get(getAllRentals).post(createRental);
rentalRouter
  .route('/:id')
  .get(getRental)
  .put(updateRental)
  .delete(deleteRental);

module.exports = rentalRouter;
