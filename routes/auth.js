const express = require('express');
const router = express.Router();
const {login, register, logout} = require('../controllers/auth_controller')
const passport = require("passport");

router
    .post("/login", passport.authenticate('local'), login)
    .post("/register", register)
    .post("/logout", logout)

module.exports = router;