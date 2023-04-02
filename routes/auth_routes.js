const router = require('express').Router();
const passport = require('passport')

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        msg: 'Authentication failed'
    })
})

// not using, but might
router.get('/login/success', (req, res) => {
    if(req.user){
        res.status(200).json({
            msg: 'Authentication successful',
            user: req.user,
            cookies: req.cookies
            // or if using jwt could send it here
        })
    }
    else{
        res.status(500).json({
            msg: 'Nothing to see here'
        })
    }
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:3000')
})

router.get('/google', passport.authenticate('google', {
    scope: ['profile'] // only interested in basic profile info
}))

// after login process, call this url
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: '/login/failed'
}))



module.exports = router