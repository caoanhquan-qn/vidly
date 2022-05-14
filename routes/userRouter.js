const express = require('express');
const userRouter = express.Router();

const {
  getAllUsers,
  getUser,
  createUser,
} = require('../controllers/userController');
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser);

module.exports = userRouter;
