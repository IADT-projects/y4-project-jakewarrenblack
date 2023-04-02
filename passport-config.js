const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user_schema')
const bcrypt = require('bcryptjs')
const mongoose = require("mongoose");


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
    passport.deserializeUser(async (id, done) => {
        let mongoID = new mongoose.mongo.ObjectId(id);

        let user = await User.findOne( { "_id": mongoID } )

        return done(null, user)
    })

}


module.exports = {
    initialisePassport
}