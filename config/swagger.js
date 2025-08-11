const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Restaurant Backend',
      version: '1.0.0',
      description: 'API pour la gestion d\'un restaurant avec authentification, produits, commandes et tables',
      contact: {
        name: 'Support API',
        email: 'support@restaurant.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './app.js'] // Fichiers à scanner pour la documentation
};

const specs = swaggerJsdoc(options);

module.exports = specs; 