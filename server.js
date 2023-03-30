const express = require("express");
const { Server } = require("socket.io");
const {createServer} = require("http");
require('dotenv').config();
const app = express();
const cors = require('cors')
const axios = require("axios");
const { io } = require("socket.io-client");

const port = process.env.PORT || 3001;

app.use(cors())

const httpServer = createServer(app)


// We send socket events to the client
const socketServer = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['POST', 'GET'],
    }
});



app.use('/api/pair', require('./routes/pair'))

app.use('/api/buzz', require('./routes/buzz'))

app.use('/api/feed', require('./routes/feed'))

let img; // reference most recently received image


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
        //console.log('Received image:', data)

        // I could also set this img variable and provide access to it through a REST endpoint like /feed
        // Not sure if that would be too slow compared to using SocketIO directly
        //img = data;

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