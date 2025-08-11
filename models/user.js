const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Restaurant = require('./restaurant');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  restaurant_id: { type: DataTypes.INTEGER, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { 
    type: DataTypes.ENUM('admin', 'cashier', 'client'), 
    allowNull: false,
    defaultValue: 'client',
  },
}, {
  timestamps: true,
  tableName: 'users',
});

User.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });
Restaurant.hasMany(User, { foreignKey: 'restaurant_id' });

module.exports = User;
