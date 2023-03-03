import React, {useEffect, useRef, useState} from "react";
import axios from "axios";

function App() {

  return (
    <div className={'flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto p-2'}>
        <div className={'[&>*]:w-full flex'}>
            <img alt={'video feed'} src={'http://127.0.0.1:5000/video_feed'}/>
        </div>
    </div>
  );
}

export default App;
