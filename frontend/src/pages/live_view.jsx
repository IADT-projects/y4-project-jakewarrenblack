import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import Button from '../components/Button'

const LiveView = () => {

    return (
        <div className={'w-full flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto p-2 bg-navy min-h-screen'}>
            <div className={'[&>*]:w-full flex flex-col'}>
                <h1 className={'text-white text-3xl text-center font-medium'}>Live View</h1>
                <h1 className={'text-white text-base text-center mb-5 font-light'}>Motion was detected x times today</h1>
                <img style={'background:'} src={'http://127.0.0.1:5000/video_feed'}/>
                <div className={'mt-2 mb-8'}>
                    <Button btnText={'Screenshot'}/>
                    <Button btnText={'Activate Buzzer'}/>
                </div>
            </div>
        </div>
    );
}

export default LiveView;