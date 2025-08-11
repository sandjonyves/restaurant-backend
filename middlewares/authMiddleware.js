const jwt = require('../utils/jwt');
const { User } = require('../models');

// Vérifie que l'utilisateur est connecté (JWT présent et valide)
async function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verifyAccessToken(token);
    // On récupère l'utilisateur en base pour attacher à la requête
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Vérifie que l'utilisateur est un cashier
function isCashier(req, res, next) {
  if (req.user && req.user.role === 'cashier') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied: cashier only' });
}

// Vérifie que l'utilisateur est un admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied: admin only' });
}

module.exports = {
  isAuthenticated,
  isCashier,
  isAdmin,
};
