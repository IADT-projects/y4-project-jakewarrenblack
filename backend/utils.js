const path = require('path');

const cv = require('@u4/opencv4nodejs')

exports.cv = cv;

const dataPath = path.resolve(__dirname, '../data');
exports.dataPath = dataPath;
exports.getDataFilePath = fileName => path.resolve(dataPath, fileName);


// MO CODE: //

const grabFrames = async(videoFile, delay, onFrame) => {
    const cap = new cv.VideoCapture(videoFile);

    while (true){
        let frame = cap.read()

        if(frame.empty){
            cap.reset();
            frame = cap.read()
        }

        const result = await onFrame(frame)

        if(result){
            return result;
        }

        await new Promise(resolve => setTimeout(resolve, delay))
    }
}




// open camera, read frames, end of stream reached? loop back to the start
// const grabFrames = async (videoFile, delay, onFrame) => {
//     const cap = new cv.VideoCapture(videoFile); // 0 is passed as videoFile, just the webcam's index
//
//     while (true) {
//         let frame = cap.read();
//
//         if (frame.empty) {
//             cap.reset();
//             frame = cap.read();
//         }
//
//         // Call the onFrame callback and wait for it to complete
//         const result = await onFrame(frame);
//
//         if (result) {
//             return result;
//         }
//
//         // Delay before reading the next frame
//         await new Promise(resolve => setTimeout(resolve, delay));
//     }
// };


// const grabFrames = async (videoFile, delay, onFrame) => {
//     const cap = new cv.VideoCapture(videoFile);
//
//     // infinite loop of reading camera frames
//     setInterval(() => {
//         let frame = cap.read();
//
//         if (frame.empty) {
//             cap.reset(); // loop back to start on end of stream reached
//             frame = cap.read();
//         }
//         // onFrame method received from runVideoDetection
//         const result = onFrame(frame);
//
//         if(result){
//             return result;
//         }
//
//     }, delay);
// };


exports.grabFrames = grabFrames;


// exports.runVideoDetection = async (src, detect) => {
//
//     // src is 0, our webcam index, 1000 delay to give it a chance to process the frame, and the callback takes the returned camera frame and runs the detect method on it
//     let res = await grabFrames(src, 1000, async frame => {
//         return await detect(frame) // this is the classifyImg function, which returns jpeg encoded version of our image, with the yolo stuff applied to it
//     })
//
//     return res;
// };

exports.runVideoDetection = async (src, detect) => {

    let res = await grabFrames(src, 1, detect);
    //result = await detect(frame)
    return res;
}

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