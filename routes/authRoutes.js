const express = require('express');
const router = express.Router();
const { handleOAuthLogin } = require('../controllers/authController');
const { loginUser } = require('../controllers/LoginController');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de l'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'utilisateur
 *         name:
 *           type: string
 *           description: Nom de l'utilisateur
 *         role:
 *           type: string
 *           enum: [admin, cashier, client]
 *           description: Rôle de l'utilisateur
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OAuthProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         displayName:
 *           type: string
 *         emails:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *     OAuthTokens:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *         refresh_token:
 *           type: string
 *     OAuthLoginRequest:
 *       type: object
 *       required:
 *         - profile
 *         - tokens
 *       properties:
 *         profile:
 *           $ref: '#/components/schemas/OAuthProfile'
 *         tokens:
 *           $ref: '#/components/schemas/OAuthTokens'
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur avec email et mot de passe
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de l'utilisateur
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email et mot de passe requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email and password are required."
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid email or password."
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/oauth/login:
 *   post:
 *     summary: Connexion OAuth avec Google
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OAuthLoginRequest'
 *     responses:
 *       200:
 *         description: Connexion OAuth réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Données invalides - profile et tokens requis
 *       500:
 *         description: Erreur serveur
 */
// Route pour la connexion OAuth
router.post('/oauth/login', async (req, res, next) => {
  try {
    const { profile, tokens } = req.body;
    if (!profile || !tokens) {
      return res.status(400).json({ error: 'profile and tokens are required' });
    }
    const result = await handleOAuthLogin(profile, tokens);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
