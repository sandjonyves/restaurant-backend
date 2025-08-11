const { Restaurant } = require('../models');

// Récupérer tous les restaurants
async function getAllRestaurants(req, res) {
  try {
    const restaurants = await Restaurant.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Récupérer un restaurant par ID
async function getRestaurantById(req, res) {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Créer un nouveau restaurant
async function createRestaurant(req, res) {
  try {
    const { name, location } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Restaurant name is required' });
    }
    const restaurant = await Restaurant.create({
      name,
      location
    });
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Restaurant with this name already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Mettre à jour un restaurant
async function updateRestaurant(req, res) {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    if (!name) {
      return res.status(400).json({ error: 'Restaurant name is required' });
    }
    await restaurant.update({
      name,
      location
    });
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Restaurant with this name already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Supprimer un restaurant
async function deleteRestaurant(req, res) {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    await restaurant.destroy();
    res.status(200).json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
}; 