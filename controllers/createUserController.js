const { generateAccessToken } = require('../utils/jwt');
const { createUser } = require('../utils/createUser');
const { setTokensInCookies } = require('../utils/setTokensInCookies');
async function createUserAndLogin(req, res, next) {
  try {
    const { name, email, password, role = 'client' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const user = await createUser({ name, email, password, role });

    const userSafe = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (role === 'client') {
      const accessToken = generateAccessToken(userSafe);
      setTokensInCookies(res, accessToken);
      
      return res.status(201).json({ success: true, user: userSafe,token:accessToken });
    } else {
      return res.status(201).json({ success: true, user: userSafe });
    }
  } catch (err) {
    console.error('Error creating user:', err);
    if (err.message === 'User already exists.') {
      return res.status(409).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
    createUserAndLogin,
}




//production code


// const { generateAccessToken } = require('../utils/jwt');
// const { createUser } = require('../utils/createUser');
// const { setTokensInCookies } = require('../utils/setTokensInCookies');

// async function createUserAndLogin(req, res, next) {
//   try {
//     const { name, email, password, role = 'client' } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ error: 'Name, email, and password are required.' });
//     }

//     const allowedRoles = ['client', 'cashier', 'admin'];

//     if (!allowedRoles.includes(role)) {
//       return res.status(400).json({ error: 'Invalid role provided.' });
//     }

//     // Si l'utilisateur veut créer un admin ou un caissier, il doit être admin lui-même
//     if (['admin', 'cashier'].includes(role)) {
//       // req.user est injecté par le middleware d'authentification
//       if (!req.user || req.user.role !== 'admin') {
//         return res.status(403).json({ error: 'Only admin can create an admin or cashier.' });
//       }
//     }

//     const user = await createUser({ name, email, password, role });

//     const userSafe = {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     };

//     // Si c’est un client qui vient de s’inscrire, connecte-le directement
//     if (role === 'client') {
//       const accessToken = generateAccessToken(userSafe);
//       setTokensInCookies(res, accessToken);
//       return res.status(201).json({ 
//         success: true,
//         user: userSafe,
//         token: accessToken 
//       });
//     } else {
//       // Sinon (admin ou cashier), pas de login auto
//       return res.status(201).json({ 
//         success: true,
//         user: userSafe 
//       });
//     }
//   } catch (err) {
//     console.error('Error creating user:', err);
//     if (err.message === 'User already exists.') {
//       return res.status(409).json({ error: err.message });
//     }
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }

// module.exports = {
//   createUserAndLogin,
// };
