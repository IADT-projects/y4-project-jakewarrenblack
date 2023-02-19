import React, {useEffect, useRef, useState} from "react";
// import 'webrtc-adapter'
import DiffCamEngine from "diff-cam-engine";

function App() {
    const [score, setScore] = useState(0)
    const motion = useRef(null)
    const video = useRef(null)
    const scoreEl = useRef(null)

    useEffect(() => {
        DiffCamEngine.init({
            video: video.current,
            motionCanvas: motion.current,
            initSuccessCallback: () => DiffCamEngine.start(),
            initErrorCallback: () => alert('Something went wrong'),
            captureCallback: payload => setScore(payload.score)
        });
    }, [])

    useEffect(() => {
        if(score > 100){
            alert('Movement')
            setScore(0)
        }
    }, [score])

  return (
    <div>
        <figure>
            <video className={'bg-black'} ref={video}></video>
            <figcaption>Live Video</figcaption>
        </figure>

        <figure>
            <canvas ref={motion} className={'w-1/4 h-1/4 rendering-pixelated bg-black'}></canvas>
            <figcaption>
                Motion Heatmap<br/>
                Score: <span ref={scoreEl}>{score.toString()}</span>
            </figcaption>
        </figure>
    </div>
  );
}

export default App;
