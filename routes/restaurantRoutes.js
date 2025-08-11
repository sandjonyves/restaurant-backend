const express = require('express');
const router = express.Router();
const { getAllRestaurants, getRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant } = require('../controllers/restaurantController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du restaurant
 *         name:
 *           type: string
 *           description: Nom du restaurant
 *         c:
 *           type: string
 *           description: Adresse/emplacement du restaurant
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière modification
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Récupérer tous les restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: Liste des restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *   post:
 *     summary: Créer un nouveau restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du restaurant
 *                 example: "Le Petit Bistrot"
 *               location:
 *                 type: string
 *                 description: Adresse/emplacement du restaurant
 *                 example: "123 Rue de la Paix, Paris"
 *     responses:
 *       201:
 *         description: Restaurant créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Nom du restaurant requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Restaurant name is required"
 *       409:
 *         description: Restaurant avec ce nom existe déjà
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Restaurant with this name already exists"
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé - Admin requis
 *       500:
 *         description: Erreur serveur interne
 */
router.get('/', getAllRestaurants);
// router.post('/', isAuthenticated, isAdmin, createRestaurant);
router.post('/', createRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Récupérer un restaurant par ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du restaurant
 *     responses:
 *       200:
 *         description: Restaurant trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Restaurant not found"
 *       500:
 *         description: Erreur serveur interne
 *   put:
 *     summary: Mettre à jour un restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du restaurant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du restaurant
 *                 example: "Le Petit Bistrot"
 *               location:
 *                 type: string
 *                 description: Adresse/emplacement du restaurant
 *                 example: "123 Rue de la Paix, Paris"
 *     responses:
 *       200:
 *         description: Restaurant mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Nom du restaurant requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Restaurant name is required"
 *       404:
 *         description: Restaurant non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Restaurant not found"
 *       409:
 *         description: Restaurant avec ce nom existe déjà
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Restaurant with this name already exists"
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé - Admin requis
 *       500:
 *         description: Erreur serveur interne
 *   delete:
 *     summary: Supprimer un restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du restaurant
 *     responses:
 *       200:
 *         description: Restaurant supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Restaurant deleted successfully"
 *       404:
 *         description: Restaurant non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Restaurant not found"
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé - Admin requis
 *       500:
 *         description: Erreur serveur interne
 */
router.get('/:id', getRestaurantById);
router.put('/:id', isAuthenticated, isAdmin, updateRestaurant);
router.delete('/:id', isAuthenticated, isAdmin, deleteRestaurant);

module.exports = router; 