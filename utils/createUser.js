// utils/user.js
const bcrypt = require('bcrypt');
const { User } = require('../models');

async function createUser({ name, email, password = null, role = 'client' }) {
  // Vérifie si l'utilisateur existe déjà
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists.');
  }

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return user;
}

module.exports = { createUser };
