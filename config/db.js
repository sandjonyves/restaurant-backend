const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // fichier SQLite à la racine du projet
  logging: false,
});

module.exports = sequelize;