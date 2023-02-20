import React, {useEffect, useRef, useState} from "react";
import DiffCamEngine from "diff-cam-engine";

function App() {
    const [captureData, setCaptureData] = useState(null)
    const motion = useRef(null)
    const video = useRef(null)
    const scoreEl = useRef(null)
    const [capturedImage, setCapturedImage] = useState('')

    useEffect(() => {
        DiffCamEngine.init({
            video: video.current,
            motionCanvas: motion.current,
            initSuccessCallback: () => DiffCamEngine.start(),
            initErrorCallback: () => alert('Something went wrong'),
            captureCallback: payload => setCaptureData(payload) // payload.imageData contains an image in the Uint8ClampedArray format
        });
    }, [])

    useEffect(() => {
        if(captureData?.score > 100){
            alert('Movement')

            // TODO: Send this same image data to the backend for storage on s3. We can use it for performing inference with our ML model.
            setCapturedImage(captureData.getURL())
        }
    }, [captureData?.score])


  return (
    <div className={'flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto'}>
        <div className={'[&>*]:w-full flex'}>
            <figure>
                <figcaption>Live Video</figcaption>
                <video className={'bg-black w-full h-full'} ref={video}></video>
            </figure>

            <figure>
                <figcaption className={'flex'}>
                    <strong className={'mr-2'}>Motion Heatmap</strong>
                    Movement Threshold: <span ref={scoreEl}>{captureData?.score}</span>
                </figcaption>
                <canvas ref={motion} className={'w-full h-full rendering-pixelated bg-black'}></canvas>
            </figure>
        </div>

        <figure className={'mt-5 w-full h-full'}>
            { capturedImage &&
                <figure>
                    <figcaption>Last detected movement:</figcaption>
                    <img className={'w-full h-full'} alt={'Screenshot of motion capture'} src={capturedImage}/>
                </figure>
            }
        </figure>
    </div>
  );
}

export default App;
