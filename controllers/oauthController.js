const passport = require('passport');
const OAuthUser = require('../models/oauthUser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails } = profile;
  try {
    let user = await OAuthUser.findOne({ googleId: id });
    if (!user) {
      user = new OAuthUser({ googleId: id, name: displayName, email: emails[0].value });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    console.error(err.message);
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await OAuthUser.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

exports.oauthGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.oauthGoogleCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/' }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect('/');
    
    req.logIn(user, err => {
      if (err) return next(err);
      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.redirect(`/auth/success?token=${token}`);
      });
    });
  })(req, res, next);
};
