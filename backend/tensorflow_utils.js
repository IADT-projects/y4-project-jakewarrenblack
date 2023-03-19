const path = require('path');

const cv = require('@u4/opencv4nodejs');

const Jimp = require("jimp");
const fs = require('fs')
const qrCode = require('qrcode-reader');
const util = require("util");
const { v4: uuidv4 } = require('uuid');

exports.cv = cv;

const dataPath = path.resolve(__dirname, '../data');
exports.dataPath = dataPath;
exports.getDataFilePath = fileName => path.resolve(dataPath, fileName);


// Various attempts at improving speed/framerate:

/*
gstreamer pipeline = v4l2src ! video/x-raw,format=BGR,width=640,height=480,framerate=30/1 ! appsink

this works, but is slow: const capture = new cv.VideoCapture('v4l2src device=/dev/video0 ! videoconvert ! video/x-raw,format=BGR,width=640,height=480,framerate=30/1 ! appsink')

const capture = new cv.VideoCapture('v4l2src device=/dev/video0 ! videoconvert ! video/x-raw,format=BGR,width=320,height=240,framerate=30/1 ! appsink')

gst-launch-1.0 -vvv v4l2src device=/dev/video0 ! 'video/x-raw,framerate=30/1,format=UYVY' ! v4l2h264enc ! 'video/x-h264,level=(string)4' ! decodebin ! videoconvert ! appsink

trying to use the GPU, doesn't work: const capture = new cv.VideoCapture('v4l2src device=/dev/video0 ! video/x-raw,format=YUY2,width=640,height=480,framerate=30/1 ! videoconvert ! omxh264enc ! video/x-h264,profile=high ! appsink')

const capture = new cv.VideoCapture('v4l2src device=/dev/video0 ! image/jpeg.width=640,height=480,framerate=30/1 ! jpegdec ! videoconvert ! appsink')
*/


// seems reasonably fast: const capture = new cv.VideoCapture('v4l2src device=/dev/video0 ! videoconvert ! video/x-raw,format=BGR,width=640,height=480,framerate=30/1 ! appsink')

const grabFrames = async (videoFile, delay, onFrame) => {
  
  //let done = false;
  while(true) {    
    
    let frame = capture.read();

    if (frame.empty) {
      cap.reset();
      frame = cap.read();
    }

    // Call the onFrame callback and wait for it to complete
    const result = await onFrame(frame);

    if (result) {
      return result;
    }

    // Delay before reading the next frame
    await new Promise(resolve => setTimeout(resolve, delay));

  }
};
exports.grabFrames = grabFrames;


exports.readQRCode = async () => {
 // console.log('scanning for QR code')
  const cap = new cv.VideoCapture(0);
  let frameReady = true;

  cap.readAsync = util.promisify(cap.read);

  let result;

  const readFrame = async () => {
    if (frameReady) {
      frameReady = false;

      const frame = cap.read();

      // jimp expects a buffer, but opencv returns a 'mat' object
      // convert accordingly
      const buffer = cv.imencode('.jpg', frame).toString('base64')
      const image = await Jimp.read(Buffer.from(buffer, 'base64'));

        const qrcode = new qrCode();
        qrcode.callback = function (err, value) {
          if (err) {
            result = err;
            //console.error(err);
          }
          // Printing the decrypted value
          if(value){
            //console.log(value.result);
            result = value.result;
          }

          frameReady = true;

        };
        if(image.bitmap) {
          // Decoding the QR code
          qrcode.decode(image.bitmap);
        }
    }

   // setTimeout(readFrame, 100);
  };

  return await readFrame().then(() => {
    return result;
  })
};



exports.runVideoDetection = async (src, detect) => {

  let res = await grabFrames(src, 1000, async frame => {
    return await detect(frame) // this is the classifyImg function, which returns jpeg encoded version of our image, with the yolo stuff applied to it
  })

  return res;
};



exports.drawRectAroundBlobs = (binaryImg, dstImg, minPxSize, fixedRectWidth) => {
  const {
    centroids,
    stats
  } = binaryImg.connectedComponentsWithStats();

  // pretend label 0 is background
  for (let label = 1; label < centroids.rows; label += 1) {
    const [x1, y1] = [stats.at(label, cv.CC_STAT_LEFT), stats.at(label, cv.CC_STAT_TOP)];
    const [x2, y2] = [
      x1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_WIDTH)),
      y1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_HEIGHT))
    ];
    const size = stats.at(label, cv.CC_STAT_AREA);
    const blue = new cv.Vec(255, 0, 0);
    if (minPxSize < size) {
      dstImg.drawRectangle(
        new cv.Point(x1, y1),
        new cv.Point(x2, y2),
        { color: blue, thickness: 2 }
      );
    }
  }
};

const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
  image.drawRectangle(
    rect,
    color,
    opts.thickness,
    cv.LINE_8
  );

exports.drawRect = drawRect;
exports.drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(255, 0, 0), opts);
exports.drawGreenRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 255, 0), opts);
exports.drawRedRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 0, 255), opts);
