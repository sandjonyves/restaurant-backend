const {handleOAuthLogin} = require('./authController')
const { setTokensInCookies } = require('../utils/setTokensInCookies');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { RefreshToken } = require('../models');
require('dotenv').config();

async function oauthCallbackController(req, res, next) {
  try {
    
    const result = await handleOAuthLogin(req.userProfile,res);

    const expiresIn = parseInt(process.env.EXPIRE_TOKEN, 10) || 604800;
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await RefreshToken.create({
      token: result.refreshToken,
      userId: result.user.id,
      expiresAt,
    });

    setTokensInCookies(res, result.accessToken, result.refreshToken, expiresIn);

    return res.status(200).json({ success: true, user: result.user });
  } catch (err) {
    console.error('OAuth login error:', err);
    next(err);
  }
}


async function loginUser(req, res) {
  try {
    const { email, password, name } = req.body; // Ajout du champ name pour la création
    console.log('Données reçues pour la connexion:', req.body);
    // Vérifie si les champs sont présents
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Recherche l'utilisateur
    let user = await User.findOne({ where: { email } });
    
    // Si l'utilisateur n'existe pas, on le crée
    if (!user) {
      try {
        // Hash du mot de passe pour le nouvel utilisateur
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Création du nouvel utilisateur
        user = await User.create({
          name: name || email.split('@')[0], // Utilise le nom fourni ou la partie avant @ de l'email
          email: email,
          password: hashedPassword,
          role: 'client' // Rôle par défaut
        });
        
        console.log(`Nouvel utilisateur créé: ${email}`);
      } catch (createError) {
        console.error('Erreur lors de la création de l\'utilisateur:', createError);
        return res.status(500).json({ error: 'Error creating user.' });
      }
    } else {
      // Si l'utilisateur existe, on vérifie le mot de passe
      if (!user.password) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      
      // Compare les mots de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
    }

    // Préparation des données utilisateur (sans mot de passe)
    const userSafe = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Génère les tokens JWT
    const accessToken = generateAccessToken(userSafe);
    const refreshToken = generateRefreshToken(userSafe);

    // Enregistre le refreshToken dans la base
    const expiresIn = parseInt(process.env.EXPIRE_TOKEN, 10) || 604800; // 7 jours
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: expiresAt,
    });

    // Définit les tokens dans les cookies
    setTokensInCookies(res, accessToken, refreshToken, expiresIn);

    // Renvoie l'utilisateur connecté
    return res.status(200).json({ 
      success: true, 
      user: userSafe,
      token: accessToken,
      isNewUser: !user.createdAt || user.createdAt.getTime() === user.updatedAt.getTime() // Indique si c'est un nouvel utilisateur
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
  
  module.exports={
    oauthCallbackController,
    loginUser
  }