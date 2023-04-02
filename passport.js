// const passport = require("passport");
// const GoogleStrategy = require('passport-google-oauth20').Strategy
// const GOOGLE_CLIENT_SECRET = process.env['GOOGLE_CLIENT_SECRET']
// const GOOGLE_CLIENT_ID = process.env['GOOGLE_CLIENT_ID']
//
// passport.use(new GoogleStrategy({
//         clientID: GOOGLE_CLIENT_ID,
//         clientSecret: GOOGLE_CLIENT_SECRET,
//         callbackURL: "/api/auth/google/callback"
//     },
//     function(accessToken, refreshToken, profile, done) {
//         //console.log('profile', profile)
//         return done(null, profile)
//     }
// ));
//
// // when using sessions, we need these methods
// passport.serializeUser((user,done) => {
//     console.log('passport serialize', user)
//     done(null,user)
//
//     // could also do e.g. with mongo
//     /*
//         const user = {
//             username: profile.displayName,
//             avatar: profile.photos[0]
//         }
//
//         then create a new user
//
//         user.save()
//     */
// })
//
// passport.deserializeUser((user,done) => {
//     done(null,user)
// })