// utils/setTokensInCookies.js
function setTokensInCookies(res, accessToken, refreshToken, expiresIn) {
  const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: accessTokenMaxAge,
  });

  // res.cookie('refreshToken', refreshToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'Strict',
  //   maxAge: expiresIn * 1000, // expiresIn est en secondes
  // });
}

module.exports = { setTokensInCookies };
