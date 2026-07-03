import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

export const configurePassport = (passport) => {
  // JWT Strategy — used for protected API routes
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.id).select('-password');
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          logger.error('Passport JWT error:', error);
          return done(error, false);
        }
      }
    )
  );

  // Google OAuth 2.0 Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(null, false, { message: 'No email from Google' });

          let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

          if (!user) {
            user = await User.create({
              name: profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`,
              email,
              googleId: profile.id,
              avatar: profile.photos?.[0]?.value,
              isEmailVerified: true,
              role: 'user'
            });
            logger.info(`New user registered via Google OAuth: ${email}`);
          } else if (!user.googleId) {
            user.googleId = profile.id;
            if (!user.avatar) user.avatar = profile.photos?.[0]?.value;
            user.isEmailVerified = true;
            await user.save();
            logger.info(`Existing user linked to Google OAuth: ${email}`);
          }

          return done(null, user);
        } catch (error) {
          logger.error('Google OAuth error:', error);
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password');
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
