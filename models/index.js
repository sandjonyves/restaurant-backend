const sequelize = require('../config/db');

const User = require('./user');
const RefreshToken = require('./refreshToken');
const Category = require('./category');
const Product = require('./product');
const Restaurant = require('./restaurant');
const RestaurantTable = require('./restaurantTable');
const Order = require('./order');
const OrderItem = require('./orderItem');

// Relations
User.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

Restaurant.hasMany(RestaurantTable, { foreignKey: 'restaurant_id' });
RestaurantTable.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

// ... ajoute les autres relations ici

module.exports = {
  sequelize,
  User,
  RefreshToken,
  Category,
  Product,
  Restaurant,
  RestaurantTable,
  Order,
  OrderItem,
};
