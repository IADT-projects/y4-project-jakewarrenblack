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

setInterval(() => {

    runVideoDetection(0, classifyImg).then((res) => {
        io.emit('image', res);
    }).catch((e) => {
        console.log(e)
    })

},1000)


httpServer.listen(3001);