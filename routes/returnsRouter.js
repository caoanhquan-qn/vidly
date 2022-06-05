const express = require('express');
const returnsRouter = express.Router();

const { createReturns } = require('../controllers/returnsController');
const protect = require('../middleware/protect');

returnsRouter.route('/').post(protect, createReturns);

module.exports = returnsRouter;
