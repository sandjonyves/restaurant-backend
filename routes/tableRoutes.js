const express = require('express');
const router = express.Router();
const { getAllTables, getTableById, createTable, updateTable, deleteTable } = require('../controllers/tableController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Table:
 *       type: object
 *       required:
 *         - number
 *         - capacity
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de la table
 *         number:
 *           type: integer
 *           description: Numéro de la table
 *         capacity:
 *           type: integer
 *           description: Capacité de la table
 *         status:
 *           type: string
 *           enum: [available, occupied, reserved]
 *           description: Statut de la table
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/tables:
 *   get:
 *     summary: Récupérer toutes les tables
 *     tags: [Tables]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, occupied, reserved]
 *         description: Filtrer par statut
 *     responses:
 *       200:
 *         description: Liste des tables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Table'
 *   post:
 *     summary: Créer une nouvelle table
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - capacity
 *             properties:
 *               number:
 *                 type: integer
 *               capacity:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [available, occupied, reserved]
 *     responses:
 *       201:
 *         description: Table créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.get('/', getAllTables);

/**
 * @swagger
 * /api/tables/{id}:
 *   get:
 *     summary: Récupérer une table par ID
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la table
 *     responses:
 *       200:
 *         description: Table trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *       404:
 *         description: Table non trouvée
 *   put:
 *     summary: Mettre à jour une table
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la table
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: integer
 *               capacity:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [available, occupied, reserved]
 *     responses:
 *       200:
 *         description: Table mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *       404:
 *         description: Table non trouvée
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé - Admin requis
 *   delete:
 *     summary: Supprimer une table
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la table
 *     responses:
 *       200:
 *         description: Table supprimée
 *       404:
 *         description: Table non trouvée
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.get('/:id', getTableById);
// router.post('/', isAuthenticated, isAdmin, createTable);
router.post('/', createTable);

router.put('/:id', isAuthenticated, isAdmin, updateTable);
router.delete('/:id', isAuthenticated, isAdmin, deleteTable);

module.exports = router;
