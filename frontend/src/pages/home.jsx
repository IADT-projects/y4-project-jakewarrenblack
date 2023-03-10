import React, {useEffect, useLayoutEffect, useState} from "react";
import {Button} from '../components/Button'
import axios from "axios";
import {io} from 'socket.io-client'

export const Home = () => {
    //connect to the socket server.
    const socket = io.connect("http://localhost:3001/");


    useEffect(() => {
        // array buffer to base64 encoded string
        socket.on("image", function (arrayBuffer) {
            const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            //console.log(base64String)
             document.getElementById('img').src = `data:image/jpeg;base64,${base64String}`
        });

        socket.on("detection", function (detectionLabel) {
            console.log(detectionLabel)
        });

    }, [socket])



    return (
        <div className={'w-full flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto p-2 bg-navy min-h-screen'}>
            <div className={'[&>*]:w-full flex flex-col'}>
                <h1 className={'text-white text-3xl text-center font-medium'}>Live View</h1>
                <h1 className={'text-white text-base text-center mb-5 font-light'}>Motion was detected x times today</h1>
                <img id={'img'} src={'https://placeholder.pics/svg/600/DEDEDE/555555/Attempting%20to%20load%20video%20feed...'}/>
                <div className={'mt-2 mb-8'}>
                    <Button btnText={'Screenshot'}/>
                    <Button btnText={'Activate Buzzer'}/>
                </div>
            </div>
        </div>
    );
}