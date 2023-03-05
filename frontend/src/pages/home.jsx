import React, {useEffect, useState} from "react";
import {Button} from '../components/Button'
import axios from "axios";

export const Home = () => {


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