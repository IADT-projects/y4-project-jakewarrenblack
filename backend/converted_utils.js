const path = require("path")
const fs = require("fs")
const cv = require("@u4/opencv4nodejs")
const Axios = require("axios")
const ProgressBar = require("progress")
const pc = require("picocolors")
const crypto = require("crypto")

exports.cv = cv;

exports.delay = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.getCachedFile = (localName, url, opts) => {
    opts = opts || {}
    const localFile = path.resolve(__dirname, localName)
    if (fs.existsSync(localFile)) {
        return Promise.resolve(localFile)
    }
    if (opts.notice) console.log(opts.notice)
    console.log(
        `Can not find ${pc.yellow(
            localName
        )} try downloading file from ${pc.underline(pc.cyan(url))}`
    )
    const parent = path.dirname(localFile)
    try {
        fs.mkdirSync(parent, { recursive: true })
    } catch (e) {
        // ignore error
    }
    return new Promise(async (done, reject) => {
        // console.log('Connecting server…');
        const { data, headers } = await Axios({
            url,
            method: "GET",
            responseType: "stream"
        })
        const totalLength = headers["content-length"] || "0"
        console.log(`Starting download ${localName}`)
        const writer = fs.createWriteStream(localFile)
        if (!opts?.noProgress) {
            const progressBar = new ProgressBar(
                "-> downloading [:bar] :percent :etas",
                {
                    width: 40,
                    complete: "=",
                    incomplete: " ",
                    renderThrottle: 1,
                    total: parseInt(totalLength)
                }
            )
            data.on("data", chunk => progressBar.tick(chunk.length))
        }
        data.pipe(writer)
        data.on("error", e => {
            console.log("reject", e)
            reject(e)
        })
        data.on("close", () => {
            const stats = fs.statSync(localFile)
            let size = ""
            if (stats.size < 1000) size = `${stats.size} Bytes`
            else if (stats.size < 1024 * 1024)
                size = `${(stats.size / 1024).toFixed(2)} KB`
            else if (stats.size < 1024 * 1024 * 1024)
                size = `${(stats.size / (1024 * 1024)).toFixed(2)} MB`
            else size = `${(stats.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
            console.log(`${size} downloaded to ${localName}`)
            done(localFile)
        })
    })
}

/**
 * add some helpter for examples TS
 */

exports.dataPath = path.resolve(__dirname, "..", "..", "data")

// export const getDataFilePath = (fileName: string): string => {
//   const fullpath = path.resolve(dataPath, fileName)
//   return fullpath;
// };

exports.getResourcePath = name => {
    const fullpath = path.resolve(dataPath, name || ".")
    return fullpath
}

const grabFrames = async (videoFile, kpDelay, onFrame) => {
    const cap = new cv.VideoCapture(videoFile)
    let done = false
    let frameid = 0
    //const intvl = setInterval(async () => {
    for (;;) {
        let frame = cap.read()
        // loop back to start on end of stream reached
        if (frame.empty) {
            cap.reset()
            frame = cap.read()
        }
        frameid++
        const p = onFrame(frame, frameid)
        if (p) await p
        const key = cv.waitKey(kpDelay)
        done = key !== -1 && key !== 255
        if (done) {
            //clearInterval(intvl);
            console.log("Key pressed, exiting.")
            return
        }
        //await delay(0)
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    //}, 0);
}

exports.runVideoDetection = (src, detect) => {
    grabFrames(src, 1, frame => {
        detect(frame)
    })
}

exports.drawRectAroundBlobs = (
    binaryImg,
    dstImg,
    minPxSize,
    fixedRectWidth
) => {
    const { centroids, stats } = binaryImg.connectedComponentsWithStats()

    // pretend label 0 is background
    for (let label = 1; label < centroids.rows; label += 1) {
        const [x1, y1] = [
            stats.at(label, cv.CC_STAT_LEFT),
            stats.at(label, cv.CC_STAT_TOP)
        ]
        const [x2, y2] = [
            x1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_WIDTH)),
            y1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_HEIGHT))
        ]
        const size = stats.at(label, cv.CC_STAT_AREA)
        const blue = new cv.Vec3(255, 0, 0)
        const thickness = 2
        if (minPxSize < size) {
            dstImg.drawRectangle(
                new cv.Point2(x1, y1),
                new cv.Point2(x2, y2),
                blue,
                thickness
            )
        }
    }
}
// drawRectangle(rect: Rect, color?: Vec3, thickness?: number, lineType?: number, shift?: number): void;
exports.drawRect = (image, rect, color, opts = { thickness: 2 }) =>
    image.drawRectangle(rect, color, opts.thickness, cv.LINE_8)

const { HEADLESS } = process.env

exports.wait4key = async () => {
    if (HEADLESS) {
        await delay(100)
        return "terminal"
    }
    // console.log('press a key to continue.');
    if (process.stdin.isTTY) process.stdin.setRawMode(true)
    process.stdin.resume()
    let done = null
    const capture = (/*data: Buffer*/) => {
        // console.log({data})
        done = "terminal"
    }
    process.stdin.on("data", capture)
    await delay(10)
    done = null
    for (;;) {
        await delay(10)
        if (~cv.waitKey(10)) {
            done = "window"
            break
        }
        if (done) break
    }
    process.stdin.off("data", capture)
    process.stdin.pause()
    if (process.stdin.isTTY) process.stdin.setRawMode(false)
    return done
}

/**
 * call cv.imshow() if HEADLESS is not set
 * else display image md5
 */
exports.cv_imshow = (winName, img) => {
    if (HEADLESS) {
        const md5sum = crypto.createHash("md5")
        const buffer = img.getData()
        md5sum.update(buffer)
        console.log(`display windows ${winName} MD5:${md5sum.digest("hex")}`)
    } else {
        return cv.imshow(winName, img)
    }
}

exports.cv_setWindowProperty = (winName, prop_id, prop_value) => {
    if (!HEADLESS) {
        return cv.setWindowProperty(winName, prop_id, prop_value)
    }
}

exports.drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
    drawRect(image, rect, new cv.Vec3(255, 0, 0), opts)
exports.drawGreenRect = (image, rect, opts = { thickness: 2 }) =>
    drawRect(image, rect, new cv.Vec3(0, 255, 0), opts)
exports.drawRedRect = (image, rect, opts = { thickness: 2 }) =>
    drawRect(image, rect, new cv.Vec3(0, 0, 255), opts)
