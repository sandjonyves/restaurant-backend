'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    // Drop the existing orders table
    await queryInterface.dropTable('orders');

    // Recreate the orders table with updated foreign key
    await queryInterface.createTable('orders', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'restaurants',
          key: 'id',
        },
      },
      table_id: pipelines
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'restaurantTable', // Updated to reference restaurantTable
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'completed', 'cancelled'),
        defaultValue: 'pending',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface) => {
    // Revert by dropping the new table and recreating the old one
    await queryInterface.dropTable('orders');
    await queryInterface.createTable('orders', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'restaurants', key: 'id' },
      },
      table_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'tables', key: 'id' }, // Old reference
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'completed', 'cancelled'),
        defaultValue: 'pending',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },
};