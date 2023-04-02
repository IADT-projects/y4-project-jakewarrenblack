const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user_schema')
const bcrypt = require('bcryptjs')


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


    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, User.findById({id}))
    })

}


module.exports = {
    initialisePassport
}