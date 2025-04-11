import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as AppleStrategy } from 'passport-apple';
import { authConfig } from './auth.config';
import { User } from '../models/user';
import { AuthProfile, AuthCallback, AuthTokens } from '../types/auth';
import { Request } from 'express';

// Serialize user for the session
passport.serializeUser((user: Express.User, done: AuthCallback) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done: AuthCallback) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: authConfig.providers.google.clientId,
  clientSecret: authConfig.providers.google.clientSecret,
  callbackURL: authConfig.providers.google.callbackURL,
}, async (accessToken: string, refreshToken: string, profile: AuthProfile, done: AuthCallback) => {
  try {
    // Check if user exists
    let user = await User.findOne({ 'google.id': profile.id });
    
    if (!user && profile.emails?.[0]?.value) {
      // Create new user
      user = await User.create({
        email: profile.emails[0].value,
        name: profile.displayName || 'Google User',
        google: {
          id: profile.id,
          email: profile.emails[0].value
        },
        isEmailVerified: true // Google emails are verified
      });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: authConfig.providers.facebook.clientId,
  clientSecret: authConfig.providers.facebook.clientSecret,
  callbackURL: authConfig.providers.facebook.callbackURL,
  profileFields: ['id', 'emails', 'name']
}, async (accessToken: string, refreshToken: string, profile: AuthProfile, done: AuthCallback) => {
  try {
    // Check if user exists
    let user = await User.findOne({ 'facebook.id': profile.id });
    
    if (!user && profile.emails?.[0]?.value) {
      // Create new user
      user = await User.create({
        email: profile.emails[0].value,
        name: profile.name ? `${profile.name.givenName} ${profile.name.familyName}` : 'Facebook User',
        facebook: {
          id: profile.id,
          email: profile.emails[0].value
        },
        isEmailVerified: true // Facebook emails are verified
      });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Apple Strategy
passport.use(new AppleStrategy({
  clientID: authConfig.providers.apple.clientId,
  teamID: authConfig.providers.apple.teamId,
  keyID: authConfig.providers.apple.keyId,
  privateKeyLocation: authConfig.providers.apple.privateKeyLocation,
  callbackURL: authConfig.providers.apple.callbackURL,
  passReqToCallback: true
}, async (req: Request, accessToken: string, refreshToken: string, idToken: string, profile: AuthProfile, done: AuthCallback) => {
  try {
    // Apple profile doesn't provide email after first login
    // Store email from first login in session
    const email = profile.email || req.session.appleEmail;
    
    if (profile.email) {
      req.session.appleEmail = profile.email;
    }
    
    // Check if user exists
    let user = await User.findOne({ 'apple.id': profile.id });
    
    if (!user && email) {
      // Create new user
      user = await User.create({
        email,
        name: profile.name?.givenName || 'Apple User',
        apple: {
          id: profile.id,
          email
        },
        isEmailVerified: true // Apple emails are verified
      });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
})); 