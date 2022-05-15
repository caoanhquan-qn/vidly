const express = require('express');
const userRouter = express.Router();

const { getAllUsers, getUser, createUser, getMe } = require('../controllers/userController');
const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');
userRouter.route('/me').get(protect, getMe);
userRouter.route('/').get(protect, restrictTo('admin'), getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser);

module.exports = userRouter;
