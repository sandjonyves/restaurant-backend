const express = require('express');
const router = express.Router();
const { getAllOrderItems, getOrderItemById, createOrderItem, updateOrderItem, deleteOrderItem } = require('../controllers/OrderItemController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { getOrdersByUserId } = require('../controllers/orderController');

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - orderId
 *         - productId
 *         - quantity
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de l'élément de commande
 *         orderId:
 *           type: integer
 *           description: ID de la commande
 *         productId:
 *           type: integer
 *           description: ID du produit
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantité commandée
 *         unitPrice:
 *           type: number
 *           format: float
 *           description: Prix unitaire
 *         totalPrice:
 *           type: number
 *           format: float
 *           description: Prix total pour cet élément
 *         notes:
 *           type: string
 *           description: Notes spéciales pour cet élément
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/order-items:
 *   get:
 *     summary: Récupérer tous les éléments de commande
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: integer
 *         description: Filtrer par commande
 *     responses:
 *       200:
 *         description: Liste des éléments de commande
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *       401:
 *         description: Non autorisé
 *   post:
 *     summary: Créer un nouvel élément de commande
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - productId
 *               - quantity
 *             properties:
 *               orderId:
 *                 type: integer
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Élément de commande créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.get('/', getAllOrderItems);

/**
 * @swagger
 * /api/order-items/{id}:
 *   get:
 *     summary: Récupérer un élément de commande par ID
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'élément de commande
 *     responses:
 *       200:
 *         description: Élément de commande trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: Élément de commande non trouvé
 *       401:
 *         description: Non autorisé
 *   put:
 *     summary: Mettre à jour un élément de commande
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'élément de commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Élément de commande mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       404:
 *         description: Élément de commande non trouvé
 *       401:
 *         description: Non autorisé
 *   delete:
 *     summary: Supprimer un élément de commande
 *     tags: [Order Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'élément de commande
 *     responses:
 *       200:
 *         description: Élément de commande supprimé
 *       404:
 *         description: Élément de commande non trouvé
 *       401:
 *         description: Non autorisé
 */
router.get('/:id', getOrderItemById);
router.get('/user/:id', getOrdersByUserId);
router.post('/', isAuthenticated, createOrderItem);
router.put('/:id', isAuthenticated, updateOrderItem);
router.delete('/:id', isAuthenticated, deleteOrderItem);

module.exports = router; 