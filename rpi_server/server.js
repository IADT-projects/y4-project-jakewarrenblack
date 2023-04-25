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

/*
 * So it runs every 500ms
 * If res.text -> potentially saw something
 * Every time something is detected, incremenet a detection counter, up to a total of 5
 * If we see the same thing 5 or more times within the space of the cooldown (30 seconds), we can be pretty sure it's not the model making a mistake
 * Finally, if the above is true, calculate the average confidence value across our 5 detections, and see if it's above 50%
 * Emit a socketIO event to say we detected something, and clear that object out of the detections
 */

const cooldown = 30000; // 5 seconds cooldown period
const minConfidence = 0.5;
const detectionWindow = 5;
const detectionInterval = 500;

let detections = {};

let lastDetectionTime = Date.now();

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
      if (res.text && res.confidence) {
        const label = res.text;
        const confidence = parseInt(res.confidence * 100);

        // check if the confidence is above the minimum
        if (confidence < minConfidence) {
          console.log(`Skipping ${label} detection, confidence below minimum`);
          return;
        }

        const now = Date.now();
        const timeElapsedSinceLastDetection = (now - lastDetectionTime) / 1000;

        // add detection to the detections object
        if (!detections[label]) {
          detections[label] = {
            count: 1,
            confidenceSum: confidence,
            firstDetected: now,
          };
        } else {
          detections[label].count++;
          detections[label].confidenceSum += confidence;
        }

        // check if we have enough detections in the detection window
        // means we need to have seen the same thing a minimum number of times within the space of the cooldown period
        // so e.g. saying, if the time that has passed between now and the first time you saw a 'pug' is less than 30 seconds
        // AND you've seen a pug more than five times in that space of time, it's a positive
        if (
          detections[label].count >= detectionWindow &&
          timeElapsedSinceLastDetection <= cooldown
        ) {
          // if we get to here, it means we've detected the same thing 5 or more times within the timeframe of the cooldown period

          // calculate the average confidence and make sure the average confidence of our 5 detections is over 50%
          const avgConfidence =
            detections[label].confidenceSum / detections[label].count;

          // check if the average confidence is above the minimum
          if (avgConfidence >= minConfidence) {
            console.log(
              `Emitting detection event for ${label} with average confidence ${avgConfidence}`
            );
            socketClient.emit("detection", label);
          }

          // reset the detections for this label
          detections[label] = undefined;
        }

        // update the time of the last detection
        lastDetectionTime = now;
      }
    })
    .catch((e) => {
      console.log(e);
    });
}, detectionInterval);

httpServer.listen(port, () => {
  console.log(`HTTP Server listening on port ${port}`);
});
