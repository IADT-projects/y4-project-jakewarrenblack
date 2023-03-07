import React, {useEffect, useState} from "react";
import {Button} from '../components/Button'
import axios from "axios";
import {io} from 'socket.io-client'

export const Home = () => {
    //connect to the socket server.
    const socket = io.connect("http://127.0.0.1:5000/" + document.domain + ":" + location.port);

    useEffect(() => {


        //receive details from server
        socket.on("updateSensorData", function (msg) {
            console.log("Received sensorData :: " + msg.value)
        });
    }, [socket])


    return (
        <div className={'w-full flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto p-2 bg-navy min-h-screen'}>
            <div className={'[&>*]:w-full flex flex-col'}>
                <h1 className={'text-white text-3xl text-center font-medium'}>Live View</h1>
                <h1 className={'text-white text-base text-center mb-5 font-light'}>Motion was detected x times today</h1>
                <img src='http://127.0.0.1:5000/video_feed'/>
                <div className={'mt-2 mb-8'}>
                    <Button btnText={'Screenshot'}/>
                    <Button btnText={'Activate Buzzer'}/>
                </div>
            </div>
        </div>
    );
}