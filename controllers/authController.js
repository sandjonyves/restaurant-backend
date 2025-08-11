const { User, OAuthAccount, RefreshToken } = require('../models');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { setTokensInCookies } = require('../utils/setTokensInCookies');

// Trouver OAuthAccount par provider et providerId (avec User inclus)
async function findByProvider(provider, providerId) {
  return await OAuthAccount.findOne({
    where: { provider, providerId },
    include: [User],
  });
}

// Créer un OAuthAccount lié à un utilisateur
async function createOAuthAccount({ provider, providerId, userId, accessToken, refreshToken }) {
  return await OAuthAccount.create({
    provider,
    providerId,
    userId,
    accessToken,
    refreshToken,
  });
}

// Fonction principale de login OAuth
async function handleOAuthLogin(profile,res) {
  // console.log('11111111111111111111111111111111111111111111111111111111111111111111',profile)
  const provider = profile.provider || 'google';
  const providerId = profile.id;
  const email = profile.email;

  let oauthAccount = await findByProvider(provider, providerId);
  let user;

  if (oauthAccount) {
    // Cas 1 : OAuthAccount existant
    user = await User.findOne({ where: { email } });
    if(user){
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    oauthAccount.accessToken = accessToken;
    oauthAccount.refreshToken = refreshToken;
    await oauthAccount.save();
    }else{
      throw new Error("L'utilisateur associé à ce compte OAuth n'existe pas.");
    }
 

  } else {
    // Pas de OAuthAccount => Cherche user avec email
    user = await User.findOne({ where: { email } });

    if (user) {
      // Cas 2 : User existant mais pas lié à OAuthAccount → on crée le lien
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
      oauthAccount = await createOAuthAccount({
        provider,
        providerId,
        userId: user.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      // Cas 3 : Aucun user ni OAuthAccount → on refuse la connexion (pas de création auto)
      throw new Error("Ce compte OAuth n'est lié à aucun utilisateur existant.");
    }
  }

  // Générer tokens JWT
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const expiresIn = parseInt(process.env.EXPIRE_TOKEN, 10) || 604800;
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  // Stocker refreshToken en base
  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt,
  });

    setTokensInCookies(res, accessToken, refreshToken, expiresIn);
  return {
    user,
    accessToken,
    refreshToken,
  };
}

module.exports = {
  handleOAuthLogin,
};
