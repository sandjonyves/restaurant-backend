const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder, getOrdersByUserId } = require('../controllers/orderController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - tableId
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de la commande
 *         tableId:
 *           type: integer
 *           description: ID de la table
 *         userId:
 *           type: integer
 *           description: ID de l'utilisateur qui a créé la commande
 *         status:
 *           type: string
 *           enum: [pending, preparing, ready, served, cancelled]
 *           description: Statut de la commande
 *         totalAmount:
 *           type: number
 *           format: float
 *           description: Montant total de la commande
 *         notes:
 *           type: string
 *           description: Notes spéciales pour la commande
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Récupérer toutes les commandes
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, preparing, ready, served, cancelled]
 *         description: Filtrer par statut
 *       - in: query
 *         name: tableId
 *         schema:
 *           type: integer
 *         description: Filtrer par table
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Non autorisé
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tableId
 *               - status
 *             properties:
 *               tableId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, ready, served, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.get('/', getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Récupérer une commande par ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée
 *       401:
 *         description: Non autorisé
 *   put:
 *     summary: Mettre à jour une commande
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tableId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, ready, served, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Commande mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée
 *       401:
 *         description: Non autorisé
 *   delete:
 *     summary: Supprimer une commande
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande supprimée
 *       404:
 *         description: Commande non trouvée
 *       401:
 *         description: Non autorisé
 */
router.get('/:id', getOrderById);
router.get('/user/:user_id', getOrdersByUserId);
router.post('/', createOrder);
router.put('/:id', isAuthenticated, updateOrder);
router.delete('/:id', isAuthenticated, deleteOrder);

module.exports = router;
