const { User } = require('../models');

// Récupérer tous les caissiers
async function getAllCashiers(req, res, next) {
  try {
    const cashiers = await User.findAll({ where: { role: 'cashier' } });
    res.json({ success: true, data: cashiers });
  } catch (err) {
    next(err);
  }
}

// Récupérer tous les clients
async function getAllClients(req, res, next) {
  try {
    const clients = await User.findAll({ where: { role: 'client' } });
    res.json({ success: true, data: clients });
  } catch (err) {
    next(err);
  }
}

// Récupérer un utilisateur par ID
async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

// Mettre à jour un utilisateur
async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

// Supprimer un utilisateur
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllCashiers,
  getAllClients,
  getUserById,
  updateUser,
  deleteUser,
};
