const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Restaurant = require('./restaurant');

const RestaurantTable = sequelize.define('RestaurantTable', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
  table_name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
}, {
  timestamps: true,
  tableName: 'restaurantTables',
});

RestaurantTable.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });
Restaurant.hasMany(RestaurantTable, { foreignKey: 'restaurant_id' });

module.exports = RestaurantTable;
