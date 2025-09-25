const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'dev';

let sequelize;

if (env === 'prod') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // pour les tests (SQLite par exemple)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
}

module.exports = sequelize;
