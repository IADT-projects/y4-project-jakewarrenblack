const express = require("express");
const { runVideoDetection} = require("./utils/utils");
const { classifyImg} = require('./detect')
const { Server } = require("socket.io");
const {createServer} = require("http");
const app = express();
const cors = require('cors')
const axios = require("axios");
const {encode} = require("base64-arraybuffer");
const isPi = require('detect-rpi');
const { io } = require("socket.io-client");

require('dotenv').config();
const port = process.env.PORT || 3002;

app.use(cors())
const httpServer = createServer(app)

const socketServer = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['POST', 'GET'],
    }
});




//const serverURL = 'https://raid-middleman.herokuapp.com/'
const serverURL = 'http://localhost:5000'
const socketClient = io.connect(serverURL, {
    extraHeaders: {
        'x-is-pi': 'true'
    }
});

// socketClient.on("connection", function (base64string) {
//     console.log('Pi connected to the server')
// });


// socketServer.on("connection", (socket) => {
//     console.log('middleman server has connected');  socket.on('disconnect', function () {
//         console.log('middleman server has disconnected');
//     });
// });



/*
* So it runs every 500ms
* If res.text -> potentially saw something
* Increment a counter after every iteration, up to a total of 5 -> which is 2.5 seconds in real time
* Every time we iterate, if the response has a label (some detection) -> push to array out here
* If the response does not have a label (no detection) -> reset the counter to 0 and empty the array
* If we reach the top of the counter and the array is not empty, it probably is actually seeing something and not a false positive
*/

let counter = 0;
let labels = []


setInterval(() => {
        // run object detection
        runVideoDetection(0, classifyImg).then(async (res) => {
            let image;

            if(res.img){
                image = encode(res.img) // this is an array buffer until converted to base64
                socketClient.emit('receiveImage', image);
            }


            // means there is a label, potentially saw something
            if(res.text){

               // up to 2.5 seconds (500ms per iteration)
               if(counter < 5){
                    labels.push(res.text)
                    counter++
               }
               else{
                    if(labels.length){
                        // means we've reached the last iteration of the counter and there are still items in the array
                        // so we've gone through 5 iterations where the response had a label/saw an object
                        socketClient.emit('detection', res.text);
                        labels = []
                        counter = 0;
                    }
               }

            }
            else{
                labels = []
                counter = 0;
            }


            // if(res.text){
            //     // if e.g. we just detected a person, then detect a person again immediately afterward, don't notify for that
            //     // wait for 10 iterations before emitting for the same object detection again
            //
            //     // it will STILL emit if the object it's detecting CHANGES
            //     if(res.text.split(' ')[0] !== prevLabel || (emitCount === 0)){
            //         io.emit('detection', res.text);
            //
            //         // model will need to be retrained. right now it's just COCO dataset, need to modify for just animals. for now I'll check what was detected.
            //         if(res.text.split(' ')[0] === 'person'){
            //             console.log('saw a dog')
            //
            //             await axios({
            //                 method: 'POST',
            //                 url: process.env.ROBOFLOW_API_KEY,
            //                 params: {
            //                     api_key: 'NotZ49lvMpo1QwEINQgR'
            //                 },
            //                 data: image,
            //                 headers: {
            //                     "Content-Type": "application/x-www-form-urlencoded",
            //                 }
            //             })
            //             .then(async (res) => {
            //                 console.log(res.data)
            //
            //                 // no prediction, or less than 75% confident of prediction
            //                 // if(!res.data.predictions.length || res.data.predictions.confidence < 0.75){
            //                 //     shouldBuzz = true;
            //                 // }
            //
            //             }).catch((e) => {
            //                 console.log(e.message)
            //             })
            //         }
            //
            //         // if it's the case that we've emitted an event for this object already, but emitCount is 0, let it emit again, but reset counter
            //         emitCount = 10;
            //     }
            //     else{
            //         // every time we don't emit, decrease the counter,
            //         // so on the 10th iteration, if we're still detecting the same object as the first time, let the user know
            //         emitCount--;
            //     }
            //
            //     // exclude the confidence score
            //     prevLabel = res.text.split(' ')[0]
            // }

        }).catch((e) => {
            console.log(e)
        })

},500)

httpServer.listen(port, () => {
    console.log(`HTTP Server listening on port ${port}`)
})