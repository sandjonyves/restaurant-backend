const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, getProductsByCategory, createProduct, createMultipleProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - categoryId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du produit
 *         name:
 *           type: string
 *           description: Nom du produit
 *         description:
 *           type: string
 *           description: Description du produit
 *         price:
 *           type: number
 *           format: float
 *           description: Prix du produit
 *         image:
 *           type: string
 *           description: URL de l'image du produit
 *         categoryId:
 *           type: integer
 *           description: ID de la catégorie
 *         isAvailable:
 *           type: boolean
 *           description: Disponibilité du produit
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupérer tous les produits
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: Filtrer par catégorie (ID de la catégorie)
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filtrer par disponibilité (true/false)
 *       - in: query
 *         name: outOfStock
 *         schema:
 *           type: boolean
 *         description: Filtrer par disponibilité en stock (true/false)
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 count:
 *                   type: integer
 *                 filters:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: integer
 *                       nullable: true
 *                     available:
 *                       type: boolean
 *                       nullable: true
 *                     outOfStock:
 *                       type: boolean
 *                       nullable: true
 *   post:
 *     summary: Créer un nouveau produit
 *     tags: [Products]
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
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé - Admin requis
 * /api/products/category/{categoryId}:
 *   get:
 *     summary: Récupérer les produits par catégorie
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filtrer par disponibilité (true/false)
 *       - in: query
 *         name: outOfStock
 *         schema:
 *           type: boolean
 *         description: Filtrer par stock (true/false)
 *     responses:
 *       200:
 *         description: Produits trouvés pour la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 count:
 *                   type: integer
 *                 message:
 *                   type: string
 *       404:
 *         description: Catégorie non trouvée
 * /api/products/bulk:
 *   post:
 *     summary: Créer plusieurs produits à la fois
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - price
 *                     - category_id
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *                     image_url:
 *                       type: string
 *                     category_id:
 *                       type: integer
 *                     is_available:
 *                       type: boolean
 *                     is_out_of_stock:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Produits créés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.get('/', getAllProducts);
router.get('/category/:categoryId', getProductsByCategory);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Récupérer un produit par ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 *   put:
 *     summary: Mettre à jour un produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé - Admin requis
 *   delete:
 *     summary: Supprimer un produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit supprimé
 *       404:
 *         description: Produit non trouvé
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé - Admin requis
 */
router.get('/:id', getProductById);
// router.post('/', isAuthenticated, isAdmin, createProduct);
const upload = require("../middlewares/Multer");



router.post("/", upload.single("image"), createProduct);
// router.post('/bulk', isAuthenticated, isAdmin, createMultipleProducts);
router.post('/bulk', createMultipleProducts);
router.put('/:id', isAuthenticated, isAdmin, updateProduct);
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);





module.exports = router;
