// const cors = require('cors')
//const cv = require('@u4/opencv4nodejs');
// app.use(cors())

// // require('dotenv').config();

// // app.use('/api/upload', require('./routes/upload'));

// import {videoDetect} from './yoloObjectDetection'

//const {classifyImg} = require('./yoloObjectDetection')

//const { runVideoDetection } = require("./utils");
const { runVideoDetection } = require("./tensorflow_utils");
const {classifyImage, classifyImg} = require('./tf_detect')

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });


io.on("connection", (socket) => {
    console.log('user connected');  socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

let prevLabel;
let emitCount = 10;

setInterval(() => {

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

},500)


httpServer.listen(3001);