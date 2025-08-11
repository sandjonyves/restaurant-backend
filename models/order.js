const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Restaurant = require('./restaurant');
const RestaurantTable = require('./restaurantTable');
const User = require('./user');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
  table_id: { type: DataTypes.INTEGER, allowNull: true },
  user_id: { type: DataTypes.INTEGER, allowNull: true }, // null = visiteur
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { 
    type: DataTypes.ENUM('pending', 'accepted', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
  tableName: 'orders',
});

Order.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });
Restaurant.hasMany(Order, { foreignKey: 'restaurant_id' });

Order.belongsTo(RestaurantTable, { foreignKey: 'table_id' });
RestaurantTable.hasMany(Order, { foreignKey: 'table_id' });

Order.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Order, { foreignKey: 'user_id' });

module.exports = Order;
