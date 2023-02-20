import React, {useEffect, useRef, useState} from "react";
import DiffCamEngine from "diff-cam-engine";
import axios from "axios";

function App() {
    const [captureData, setCaptureData] = useState(null)
    const motion = useRef(null)
    const video = useRef(null)
    const scoreEl = useRef(null)
    const [capturedImage, setCapturedImage] = useState(null)

    useEffect(() => {
        DiffCamEngine.init({
            video: video.current,
            motionCanvas: motion.current,
            initSuccessCallback: () => DiffCamEngine.start(),
            initErrorCallback: () => alert('Something went wrong'),
            captureCallback: payload => setCaptureData(payload) // payload.imageData contains an image in the Uint8ClampedArray format
        });
    }, [])

    // diff-engine has a method 'getURL()' which returns a capture of the canvas as an ArrayBuffer. We need it as a blob to send to Express.
    const dataURItoBlob = (dataURI) => {
        const binary = atob(dataURI.split(',')[1]);
        const array = [];

        for(let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }

        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    }

    // FIXME: this runs twice because it takes time for the threshold to go down again, need to give it a few ms after capturing, so it's not noticing the same event twice
    useEffect(() => {
        if(captureData?.score > 100){
            alert('Movement')

            // inside diff-engine, captureCallback contains a getUrl method, which in turn returns the captured canvas.getDataURL()
            // to upload to s3, we should be able to convert this to a blob
            const blob = dataURItoBlob(captureData.getURL());

            // Creating a FormData object to append our data blob (image), alongside an image name
            const formData = new FormData();
            formData.append('image', blob, 'image.png');

            setCapturedImage(captureData.getURL())
            setCaptureData(null)

            axios.post('http://localhost:3001/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function (response) {
                console.log(response);
            }).catch(function (error) {
                console.log(error);
            });

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
