const express = require('express');
const customerRouter = express.Router();
const {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');

customerRouter.route('/').get(getAllCustomers).post(createCustomer);
customerRouter
  .route('/:id')
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);
module.exports = customerRouter;
