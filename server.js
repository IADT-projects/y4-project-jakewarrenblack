const express = require("express");
const { Server } = require("socket.io");
const {createServer} = require("http");
require('dotenv').config();
const app = express();
const cors = require('cors')
const axios = require("axios");
const { io } = require("socket.io-client");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require('./passport')
const path = require('path')
const db = require('./utils/db')()
const session = require('express-session')
const flash = require('express-flash')

const port = process.env.PORT || 3001;

app.use(cors())

app.use(express.json());

const httpServer = createServer(app)


// We send socket events to the client
const socketServer = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['POST', 'GET'],
    }
});

const {initialisePassport} = require('./passport-config')
initialisePassport(passport)

// app.use(flash())
app.use(session({
    secret: process.env['SESSION_SECRET'],
    resave: false, // dont resave session variables if nothing has changed
    saveUninitialized: false // dont save empty values in the session
}))

app.use(passport.initialize())
app.use(passport.session()) // for storing variables across the user's entire session


// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use(cookieSession({
//     name: 'session',
//     keys:['test'],
//     maxAge: 24 * 60 * 60 * 100 // 1 day
// }))
//
// app.use(passport.initialize(undefined))
// app.use(passport.session(undefined))

app.use('/api/pair', require('./routes/pair'))
app.use('/api/buzz', require('./routes/buzz'))
app.use('/api/auth', require('./routes/auth'))


const checkAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('http://localhost:3000/home')
}


socketServer.on("connection", (socket) => {
    console.log('user connected:', socket.id);  socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    // use this to trigger pairing mode
    socket.on('pair', () => {
        console.log('frontend wants to pair')
        app.locals.isPairing = true
    })

    socket.on('receiveImage', (data) => {
        socketServer.emit('sendImage', data);
    })

    app.locals.isPairing = false
});

// pi's job is to run preliminary inference and send frames to this middleman server
// this server will send those frames on to the client,
// it will also run secondary inference (via roboflow) if something of interest was detected
// this middle server I think will also be responsible for saving images to uploadCare (or wherever I end up using)

// not exactly sure how pairing will work, still

// Pi has 3 jobs: video feed, preliminary inference, and buzzing.
// Will it have REST endpoints? I don't think so, think Socket connection will be used for buzzing and getting images.

// the middleman server has the REST endpoints, e.g. /buzz, and /screenshot, emitting a socket event to the Pi to do what's needed.



httpServer.listen(port, () => {
    console.log(`HTTP Server listening on port ${port}`)
})