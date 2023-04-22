const express = require("express");
const { runVideoDetection } = require("./utils/utils");
const { classifyImg } = require("./detect");
const { Server } = require("socket.io");
const { createServer } = require("http");
const app = express();
const cors = require("cors");
const axios = require("axios");
const { encode } = require("base64-arraybuffer");
const isPi = require("detect-rpi");
const { io } = require("socket.io-client");

require("dotenv").config();
const port = process.env.PORT || 3002;

app.use(cors());
const httpServer = createServer(app);

const socketServer = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});

//const serverURL = 'https://raid-middleman.herokuapp.com/'
const serverURL = "http://localhost:5000";
const socketClient = io.connect(serverURL, {
  extraHeaders: {
    "x-is-pi": "true",
  },
});

app.use("/buzz", require("./routes/buzz"));

/*
 * So it runs every 500ms
 * If res.text -> potentially saw something
 * Increment a counter after every iteration, up to a total of 5 -> which is 2.5 seconds in real time
 * Every time we iterate, if the response has a label (some detection) -> push to array out here
 * If the response does not have a label (no detection) -> reset the counter to 0 and empty the array
 * If we reach the top of the counter and the array is not empty, it probably is actually seeing something and not a false positive
 */

let counter = 0;
let labels = [];

setInterval(() => {
  // run object detection
  runVideoDetection(0, classifyImg)
    .then(async (res) => {
      let image;

      if (res.img) {
        image = encode(res.img); // this is an array buffer until converted to base64
        socketClient.emit("receiveImage", image);
      }

      // means there is a label, potentially saw something
      if (res.text) {
        // up to 2.5 seconds (500ms per iteration)
        if (counter < 5) {
          labels.push(res.text);
          counter++;
        } else {
          if (labels.length) {
            // means we've reached the last iteration of the counter and there are still items in the array
            // so we've gone through 5 iterations where the response had a label/saw an object
            socketClient.emit("detection", res.text);
            labels = [];
            counter = 0;
          }
        }
      } else {
        labels = [];
        counter = 0;
      }
    })
    .catch((e) => {
      console.log(e);
    });
}, 500);

httpServer.listen(port, () => {
  console.log(`HTTP Server listening on port ${port}`);
});
