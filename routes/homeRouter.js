const express = require('express');
const homeRouter = express.Router();
const getHomePage = require('../controllers/homeController');
homeRouter.route('/').get(getHomePage);

module.exports = homeRouter;
