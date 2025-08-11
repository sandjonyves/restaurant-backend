const { RestaurantTable } = require('../models');

// Obtenir toutes les tables
async function getAllTables(req, res, next) {
  try {
    const tables = await RestaurantTable.findAll();
    console.log(tables)
    res.json({ success: true, data: tables });
  } catch (err) {
    next(err);
  }
}

// Obtenir une table par ID
async function getTableById(req, res, next) {
  try {
    const { id } = req.params;
    const table = await RestaurantTable.findByPk(id);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json({ success: true, data: table });
  } catch (err) {
    next(err);
  }
}

// Créer une nouvelle table
async function createTable(req, res, next) {
  try {
    const { restaurant_id, table_name, description } = req.body;
    if (!restaurant_id || !table_name) {
      return res.status(400).json({ error: 'restaurant_id and table_name are required' });
    }
    const table = await RestaurantTable.create({ restaurant_id, table_name, description });
    res.status(201).json({ success: true, data: table });
  } catch (err) {
    next(err);
  }
}

// Mettre à jour une table
async function updateTable(req, res, next) {
  try {
    const { id } = req.params;
    const { restaurant_id, table_name, description } = req.body;
    const table = await RestaurantTable.findByPk(id);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    if (restaurant_id !== undefined) table.restaurant_id = restaurant_id;
    if (table_name !== undefined) table.table_name = table_name;
    if (description !== undefined) table.description = description;
    await table.save();
    res.json({ success: true, data: table });
  } catch (err) {
    next(err);
  }
}

// Supprimer une table
async function deleteTable(req, res, next) {
  try {
    const { id } = req.params;
    const table = await RestaurantTable.findByPk(id);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    await table.destroy();
    res.json({ success: true, message: 'Table deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
};
