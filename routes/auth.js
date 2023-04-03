const express = require('express');
const router = express.Router();
const {login, register, logout, getUser} = require('../controllers/auth_controller')
const passport = require("passport");
const jwt = require("jsonwebtoken");
router
    .post('/login', login)
    .get('/user', getUser)
    .post("/register", register)
    .get("/logout", logout)
    .get('/google', passport.authenticate('google', { scope: ['profile'] }))
    .get('/google/callback',
        passport.authenticate('google', { failureRedirect: 'http://localhost:3000' }),
        function({user}, res) {
            // Successful authentication, req object has our user info, google ID, name, email (but no email or password, which is fine)
            let token = jwt.sign(
                {
                    _id: user._id,
                    googleID: user.googleID,
                    name: user.name,
                    photo: user.photo
                },
                process.env.APP_KEY
            );

            // So now the result is the same whether we login with google or username and password,
            // server encodes their stuff as a JWT and sends it to the client
            res.status(200).json({
                msg: "All good",
                // below outputs as 'token: token'
                token,
            });
        });

module.exports = router;