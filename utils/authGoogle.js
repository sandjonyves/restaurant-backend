const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  accessType: 'offline',   
  prompt: 'consent',      
}, async (accessToken, refreshToken, profile, done) => {
  const userProfile = {
    id: profile.id,
    email: profile.emails?.[0]?.value,
    name: profile.displayName,
    avatar: profile.photos?.[0]?.value,
    provider: 'google',
  };

  done(null, {
    profile: userProfile,
    tokens: {
      accessToken,
      refreshToken,
    },
  });
}));
