const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  juiceType: String,
  temperature: String,
  quantity: Number,
  deliveryStatus: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Order', orderSchema);

const express = require('express');
const Order = require('../models/order');
const router = express.Router();

// Place a new order
router.post('/', async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
