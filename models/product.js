const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./category');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  image_url: { type: DataTypes.TEXT, allowNull: true },
  is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_out_of_stock: { type: DataTypes.BOOLEAN, defaultValue: false },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: true,
  tableName: 'products',
});

Product.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Product, { foreignKey: 'category_id' });

module.exports = Product;
