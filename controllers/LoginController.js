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
    const { email, password } = req.body;

    // Vérifie si les champs sont présents
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Recherche l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare les mots de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

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

    // après avoir généré accessToken et refreshToken
    setTokensInCookies(res, accessToken, refreshToken, expiresIn);
    // Renvoie l'utilisateur (sans mot de passe)
    return res.status(200).json({ success: true, user: userSafe,token: accessToken });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

  
  module.exports={
    oauthCallbackController,
    loginUser
  }