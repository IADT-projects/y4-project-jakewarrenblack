const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user_schema')
const bcrypt = require('bcryptjs')
const mongoose = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy
const GOOGLE_CLIENT_SECRET = process.env['GOOGLE_CLIENT_SECRET']
const GOOGLE_CLIENT_ID = process.env['GOOGLE_CLIENT_ID']



const initialisePassport = (passport) => {
    // done callback is used when auth is finished
    const authenticateUser = async (email, password, done) => {
        const user = await User.findOne({email: email})

        if (!user) {
            // no actual server error, but no user either: null and false
            return done(null, false, {message: 'Email or password incorrect'})
        }
        try {
            // compare passport sent via login form and the existing hashed password
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            }
            else{
                // means submitted password is wrong
                return done(null, false, {message: 'Email or password incorrect'})
            }
        } catch(e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({
        // remapping default fields
        usernameField: 'email'
    }, authenticateUser))

    passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/api/auth/google/callback",
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
        },
        function(accessToken, refreshToken, profile, cb) {

            User.findOrCreate({ googleId: profile.id, name: profile.name.givenName, photo: profile.photos[0].value }, function (err, user) {
                return cb(err, user);
            });
        }
    ));


    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        let mongoID = new mongoose.mongo.ObjectId(id);

        let user = await User.findOne( { "_id": mongoID } )

        return done(null, user)
    })

}


module.exports = {
    initialisePassport
}