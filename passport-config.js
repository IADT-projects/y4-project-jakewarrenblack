const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user_schema')
const mongoose = require("mongoose");
const passport = require("passport");



const initialisePassport = (passport) => {
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

}


module.exports = {initialisePassport}