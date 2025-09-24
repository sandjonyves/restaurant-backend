const { Order, OrderItem ,  Restaurant, RestaurantTable, User, Product} = require('../models');

// Obtenir toutes les commandes
async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}

// Obtenir une commande par ID
async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

async function getOrdersByUserId(req, res, next) {
  try {
    const { user_id } = req.params;

    // On vérifie que l'user_id est fourni
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    // Recherche de toutes les commandes avec status = 'pending'
    const orders = await Order.findAll({
      where: {
        user_id,
        // status: ['pending', 'accepted'] // On peut ajuster les statuts selon les besoins
      },
      // include: [
      //   { model: OrderItem } // si tu veux inclure les produits commandés
      // ],
      order: [['createdAt', 'DESC']] 
    });
    console.log(`Found ${orders.length} orders for user_id ${user_id}`,orders);

    if (!orders.length) {
      return res.status(404).json({ error: 'No pending orders found' });
    }

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}



// Créer une nouvelle commande et ses OrderItems
async function createOrder(req, res, next) {
  console.log('Creating order with body:', req.body);

  try {
    const { table_id, user_id, total_price, status, items } = req.body;

    // Vérification des items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one item' });
    }

    // Vérification du prix total
    if (total_price == null || isNaN(total_price)) {
      return res.status(400).json({ error: 'Total price is required and must be a number' });
    }

    // Vérification de la table
    let restaurantId = null;
    if (table_id) {
      const table = await RestaurantTable.findByPk(table_id);
      if (!table) {
        return res.status(400).json({ error: 'Invalid table_id: Table not found' });
      }
      restaurantId = table.restaurant_id;
    }

    // Vérification des produits
    for (const item of items) {
      if (!item.product_id || !item.unit_price || !Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({ error: 'Each item must have a valid product_id, unit_price, and quantity' });
      }
      // Vérifier que le produit existe
      // const product = await Product.findByPk(item.product_id);
      // if (!product) {
      //   return res.status(400).json({ error: `Invalid product_id: ${item.product_id}` });
      // }
    }

    // Création de la commande
    const order = await Order.create({
      restaurant_id: restaurantId,
      table_id: table_id || null,
      user_id: user_id || null,
      total_price,
      status: status || 'pending',
    });

    // Création des items
    const orderItems = await Promise.all(
      items.map(item =>
        OrderItem.create({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity || 1,
          unit_price: item.unit_price,
          is_cold_drink: item.is_cold_drink || false,
        })
      )
    );

    res.status(201).json({ success: true, data: { order, items: orderItems } });
  } catch (err) {
    console.error('Error creating order:', err);
    next(err);
  }
}

// Mettre à jour une commande
async function updateOrder(req, res, next) {
  try {
    const { id } = req.params;
    const { restaurant_id, table_id, user_id, total_price, status } = req.body;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (restaurant_id !== undefined) order.restaurant_id = restaurant_id;
    if (table_id !== undefined) order.table_id = table_id;
    if (user_id !== undefined) order.user_id = user_id;
    if (total_price !== undefined) order.total_price = total_price;
    if (status !== undefined) order.status = status;
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

// Supprimer une commande
async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    await order.destroy();
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
}

// Valider ou rejeter une commande
async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['accepted', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: "Status must be 'accepted' or 'cancelled'" });
    }
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllOrders,
  getOrdersByUserId,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
};
