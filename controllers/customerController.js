const Customer = require('../models/customerModel');
const Joi = require('joi');

// HTTP verb requests

exports.getAllCustomers = async (req, res) => {
  const customer = await Customer.find();
  res.status(200).send(customer);
};

exports.getCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res.status(404).send('The customer with given ID was not found');
  }
  res.status(200).send(customer);
};

exports.createCustomer = async (req, res) => {
  try {
    const schema = Joi.object({
      isGold: Joi.boolean().required(),
      username: Joi.string().alphanum().min(5).max(25).required(),
      phone: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw error;
    }
    const customer = new Customer(req.body);
    const createdCustomer = await customer.save();
    res.status(201).send(createdCustomer);
  } catch (err) {
    res.status(400).send(err.message);
  }
};
exports.updateCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res.status(404).send('The customer with given ID was not found');
  }
  try {
    const schema = Joi.object({
      isGold: Joi.boolean(),
      username: Joi.string().alphanum().min(5).max(25),
      phone: Joi.string(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw error;
    }
    customer.set(req.body);
    const updatedCustomer = await customer.save();
    res.status(200).send(updatedCustomer);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteCustomer = async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    return res.status(404).send('The customer with given ID was not found');
  }
  res.status(204).send({ status: 'success', data: null });
};
