const express = require("express");
const { runVideoDetection, readQRCode} = require("./tensorflow_utils");
const { classifyImg} = require('./tf_detect')
const { Server } = require("socket.io");
const {createServer} = require("http");
require('dotenv').config();

const port = process.env.PORT || 3001;

const app = express();
const cors = require('cors')
app.use(cors())

const httpServer = createServer(app)

const io = new Server(httpServer, { /* options */ });

//app.use('/api/upload', require('./routes/upload'));



app.use('/api/pair', require('./routes/pair'))

app.use('/', (req, res, next) => {
    // set isPairing to false for all other endpoints
    app.locals.isPairing = false
    next();
});


io.on("connection", (socket) => {
    console.log('user connected');  socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    // use this to trigger pairing mode
    socket.on('pair', () => {
        console.log('frontend wants to pair')
        app.locals.isPairing = true
    })

    app.locals.isPairing = false
});

let prevLabel;
let emitCount = 10;



setInterval(() => {


    if(!app.locals.isPairing){
        // run object detection
        runVideoDetection(0, classifyImg).then((res) => {
            if(res.img){
                io.emit('image', res.img);
            }

            if(res.text){
                // if e.g. we just detected a person, then detect a person again immediately afterward, don't notify for that
                // wait for 10 iterations before emitting for the same object detection again

                // it will STILL emit if the object it's detecting CHANGES
                if(res.text.split(' ')[0] !== prevLabel || (emitCount === 0)){
                    io.emit('detection', res.text);

                    // if it's the case that we've emitted an event for this object already, but emitCount is 0, let it emit again, but reset counter
                    emitCount = 10;
                }
                else{
                    // every time we don't emit, decrease the counter,
                    // so on the 10th iteration, if we're still detecting the same object as the first time, let the user know
                    emitCount--;
                }

                // exclude the confidence score
                prevLabel = res.text.split(' ')[0]

            }

        }).catch((e) => {
            console.log(e)
        })
    }
    else{
        // detect qr codes
        readQRCode().then((res) => {
            console.log(res)
        })
    }


},500)

httpServer.listen(port, () => {
    console.log(`HTTP Server listening on port ${port}`)
})