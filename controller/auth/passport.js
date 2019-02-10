const passport = require("passport");

const { OAuth2Strategy: GoogleStrategy } = require("passport-google-oauth");
const { Strategy: GithubStrategy } = require("passport-github");

module.exports = () => {
  // Allowing passport to serialize and deserialize users into sessions
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  // The callback that is invoked when an OAuth provider sends back user
  // information. Normally, you would save the user to the database
  // in this callback and it would be customized for each provider
  const callback = (accessToken, refreshToken, profile, cb) =>
    cb(null, profile);

  // Adding each OAuth provider's strategy to passport
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_KEY,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: `http://localhost:${process.env.PORT}/google/callback`
      },
      callback
    )
  );
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_KEY,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: `http://localhost:${process.env.PORT}/github/callback`
      },
      callback
    )
  );
};
