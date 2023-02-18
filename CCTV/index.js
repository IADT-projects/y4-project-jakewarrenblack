const express = require('express')
const app = express()
const path = require('path')
// socket.io to publish images over the wire every few ms
const server = require('http').Server(app)
const io = require('socket.io')(server)
const cv = require('opencv4nodejs-prebuilt-install')

const videoCapture = new cv.VideoCapture(0)
videoCapture.set(cv.CAP_PROP_FRAME_WIDTH, 300)
videoCapture.set(cv.CAP_PROP_FRAME_HEIGHT, 300)

const FPS = 10;

// Sending the index page to localhost:3000
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

// public broadcast every 1 second to anyone connected to server
setInterval(() => {
    const frame = videoCapture.read();
    // encode as jpeg and then to base64
    const image = cv.imencode('.jpg', frame).toString('base64')

    // now sending the image over the wire every second
    io.emit('image', image)
}, 1000 / FPS)

server.listen(3000)
