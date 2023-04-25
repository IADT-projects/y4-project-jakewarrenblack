const path = require("path");
const cv = require("@u4/opencv4nodejs");
const util = require("util");
const os = require("os");

let GPIO, Buzzer;

if (os.platform() === "linux") {
  GPIO = require("onoff").Gpio;
  Buzzer = new GPIO(17, "out");
}

exports.cv = cv;

const buzz = () => {
  const duration = 5000; // 5 seconds
  const frequency = 100; // 100ms on, 100ms off
  let intervalId = setInterval(() => {
    Buzzer.writeSync(Buzzer.readSync() ^ 1); // toggle the buzzer state
  }, frequency);
  setTimeout(() => {
    clearInterval(intervalId); // stop the buzzing after the duration has passed
    Buzzer.writeSync(0);
  }, duration);
};

exports.buzz = buzz;

/*
Various attempts at improving speed/framerate:

  **this works, but is slow:**
  const capture = new cv.VideoCapture('v4l2src device=/dev/video0 ! videoconvert ! video/x-raw,format=BGR,width=640,height=480,framerate=30/1 ! appsink')

  **trying to use the GPU, doesn't work:**
  const capture = new cv.VideoCapture('v4l2src device=/dev/video0 ! video/x-raw,format=YUY2,width=640,height=480,framerate=30/1 ! videoconvert ! omxh264enc ! video/x-h264,profile=high ! appsink')

  const capture = new cv.VideoCapture('v4l2src device=/dev/video0 ! videoconvert ! video/x-raw,format=BGR,width=320,height=240,framerate=30/1 ! appsink')

  gst-launch-1.0 -vvv v4l2src device=/dev/video0 ! 'video/x-raw,framerate=30/1,format=UYVY' ! v4l2h264enc ! 'video/x-h264,level=(string)4' ! decodebin ! videoconvert ! appsink

  const capture = new cv.VideoCapture('v4l2src device=/dev/video0 ! image/jpeg.width=640,height=480,framerate=30/1 ! jpegdec ! videoconvert ! appsink')

  gstreamer pipeline = v4l2src ! video/x-raw,format=BGR,width=640,height=480,framerate=30/1 ! appsink

  **Intend to try this pipeline:**
  "v4l2src ! video/x-raw, width=1280, height=400, format=GRAY8 \
  ! videoconvert ! video/x-raw, format=I420 ! v4l2h264enc ! video/x-h264, \
  stream-format=byte-stream, alignment=au ! h264parse ! rtph264pay name=pay0 pt=96"
*/

let capture;

if (os.platform() === "linux") {
  // seems reasonably fast:
  capture = new cv.VideoCapture(
    "v4l2src device=/dev/video0 ! videoconvert ! video/x-raw,format=BGR,width=640,height=480,framerate=30/1 ! appsink"
  );
} else {
  capture = new cv.VideoCapture(0);
}

const grabFrames = async (videoFile, delay, onFrame) => {
  //let done = false;
  while (true) {
    let frame = capture.read();

    if (frame.empty) {
      capture.reset();
      frame = capture.read();
    }

    // Call the onFrame callback and wait for it to complete
    const result = await onFrame(frame);

    if (result) {
      return result;
    }

    // Delay before reading the next frame
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};
exports.grabFrames = grabFrames;

exports.runVideoDetection = async (src, detect) => {
  let res = await grabFrames(src, 1000, async (frame) => {
    return await detect(frame); // this is the classifyImg function, which returns jpeg encoded version of our image, with the yolo stuff applied to it
  });

  return res;
};

exports.drawRectAroundBlobs = (
  binaryImg,
  dstImg,
  minPxSize,
  fixedRectWidth
) => {
  const { centroids, stats } = binaryImg.connectedComponentsWithStats();

  // pretend label 0 is background
  for (let label = 1; label < centroids.rows; label += 1) {
    const [x1, y1] = [
      stats.at(label, cv.CC_STAT_LEFT),
      stats.at(label, cv.CC_STAT_TOP),
    ];
    const [x2, y2] = [
      x1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_WIDTH)),
      y1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_HEIGHT)),
    ];
    const size = stats.at(label, cv.CC_STAT_AREA);
    const blue = new cv.Vec(255, 0, 0);
    if (minPxSize < size) {
      dstImg.drawRectangle(new cv.Point(x1, y1), new cv.Point(x2, y2), {
        color: blue,
        thickness: 2,
      });
    }
  }
};

const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
  image.drawRectangle(rect, color, opts.thickness, cv.LINE_8);

exports.drawRect = drawRect;
exports.drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(255, 0, 0), opts);
exports.drawGreenRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 255, 0), opts);
exports.drawRedRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 0, 255), opts);
