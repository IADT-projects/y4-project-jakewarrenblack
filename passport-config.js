const User = require('./models/user_schema')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const GOOGLE_CLIENT_SECRET = process.env['GOOGLE_CLIENT_SECRET']
const GOOGLE_CLIENT_ID = process.env['GOOGLE_CLIENT_ID']


const initialisePassport = (passport) => {
    // I would expect to have to pass 'session: false' here, since it looks to be the default, but apparently not 🤷‍
    // (I want to use passport and passport-local-mongoose to simplify the local strategy, but still want to use JWT instead of session cookies)
    passport.use(User.createStrategy());

    passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/api/auth/google/callback",
        },
        function(accessToken, refreshToken, profile, cb) {

            User.findOrCreate({ googleId: profile.id, name: profile.name.givenName, photo: profile.photos[0].value }, function (err, user) {
                return cb(err, user);
            });
        }
    ));

    // Remember, no need to serialize and deserialize, going for JWT instead of session
}


module.exports = {initialisePassport}