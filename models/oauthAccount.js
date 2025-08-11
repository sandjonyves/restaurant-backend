const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const OAuthAccount = sequelize.define('OAuthAccount', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false, // Exemple : 'google'
  },
  providerId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // identifiant unique du provider (ex: Google ID)
  },
  accessToken: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'oauth_accounts',
});

// Associations
OAuthAccount.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(OAuthAccount, { foreignKey: 'userId' });

module.exports = OAuthAccount;
