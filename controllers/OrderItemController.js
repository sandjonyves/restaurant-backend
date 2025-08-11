const { OrderItem } = require('../models');

// Obtenir tous les OrderItems
async function getAllOrderItems(req, res, next) {
  try {
    const orderItems = await OrderItem.findAll();
    res.json({ success: true, data: orderItems });
  } catch (err) {
    next(err);
  }
}

// Obtenir un OrderItem par ID
async function getOrderItemById(req, res, next) {
  try {
    const { id } = req.params;
    const orderItem = await OrderItem.findByPk(id);
    if (!orderItem) {
      return res.status(404).json({ error: 'OrderItem not found' });
    }
    res.json({ success: true, data: orderItem });
  } catch (err) {
    next(err);
  }
}

// Créer un nouvel OrderItem
async function createOrderItem(req, res, next) {
  try {
    const { order_id, product_id, quantity, unit_price, is_cold_drink } = req.body;
    if (!order_id || !product_id || !unit_price) {
      return res.status(400).json({ error: 'order_id, product_id, and unit_price are required' });
    }
    const orderItem = await OrderItem.create({ order_id, product_id, quantity, unit_price, is_cold_drink });
    res.status(201).json({ success: true, data: orderItem });
  } catch (err) {
    next(err);
  }
}

// Mettre à jour un OrderItem
async function updateOrderItem(req, res, next) {
  try {
    const { id } = req.params;
    const { order_id, product_id, quantity, unit_price, is_cold_drink } = req.body;
    const orderItem = await OrderItem.findByPk(id);
    if (!orderItem) {
      return res.status(404).json({ error: 'OrderItem not found' });
    }
    if (order_id !== undefined) orderItem.order_id = order_id;
    if (product_id !== undefined) orderItem.product_id = product_id;
    if (quantity !== undefined) orderItem.quantity = quantity;
    if (unit_price !== undefined) orderItem.unit_price = unit_price;
    if (is_cold_drink !== undefined) orderItem.is_cold_drink = is_cold_drink;
    await orderItem.save();
    res.json({ success: true, data: orderItem });
  } catch (err) {
    next(err);
  }
}

// Supprimer un OrderItem
async function deleteOrderItem(req, res, next) {
  try {
    const { id } = req.params;
    const orderItem = await OrderItem.findByPk(id);
    if (!orderItem) {
      return res.status(404).json({ error: 'OrderItem not found' });
    }
    await orderItem.destroy();
    res.json({ success: true, message: 'OrderItem deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllOrderItems,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
