const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  image_url: { type: DataTypes.TEXT, allowNull: true },
}, {
  timestamps: true,
  tableName: 'categories',
});

module.exports = Category;
