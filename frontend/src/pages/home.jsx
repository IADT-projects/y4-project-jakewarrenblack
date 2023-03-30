import React, {useEffect, useLayoutEffect, useState} from "react";
import {Button} from '../components/Button'
import axios from "axios";
import {io} from 'socket.io-client'

export const Home = () => {
    const serverURL = `https://raid-middleman.herokuapp.com/`
    const publicVapidKey = 'BM6G-d8QYWAUCE5C7CKxmSVmEnOgUJzOs-Dml88APJqKoC3Jv9DF2sn9_mTTsz0KHyYArGYkaw4Z7X0fbdKWAKk'

    //connect to the socket server.
    const socket = io.connect(serverURL);

    useEffect(() => {
        // array buffer to base64 encoded string
        socket.on("sendImage", function (base64string) {
             document.getElementById('img').src = `data:image/jpeg;base64,${base64string}`
        });

            socket.on("detection", function (detectionLabel) {
            console.log(detectionLabel)



            // Register service worker, register push, send push
            async function send(){
                // Register service worker
                console.log('Registering service worker...')
                const register = await navigator.serviceWorker.register('../serviceworker.js')
                console.log('Service worker registered')

                // Register push
                console.log('Registering push...')
                const subscription = await register.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: publicVapidKey
                })
                console.log('Push registered...')

                // Send a push notification
                // we send our subscription object to our node backend, via the subscribe route
                await fetch(`${serverURL}/subscribe`, {
                    method: 'POST',
                    body: JSON.stringify(subscription),
                    headers: {
                        'content-type': 'application/json'
                    }
                })

                console.log('Push sent')
            }

            send().catch(err => console.error(err))
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
                    <Button onClick={() => {

                        axios.get(`${serverURL}/api/buzz`).then((res) => {
                            console.log(res)
                        }).catch((e) => console.error(e))

                    }} btnText={'Activate Buzzer'}/>
                </div>
            </div>
        </div>
    );
}