import {Oval} from 'react-loader-spinner'
import qr from '../Assets/qr_code.jpg'
import {useEffect, useState} from "react";
import axios from "axios";
import {io} from "socket.io-client";

export const Pairing = () => {
    const [code, setCode] = useState()

    useEffect(() => {
        axios.get(`http://localhost:5000/api/pair/`).then((res) => {
            setCode(res.data)
        }).catch((e) => {
            console.log(e)
        })
    }, [])

    const socket = io.connect("http://localhost:5000/");


    useEffect(() => {

        socket.emit('pair', 'i want to pair')

    }, [socket])

    return (
        <div className={'px-1'}>
            <h1 className={'text-white text-4xl text-center font-semibold mb-5'}>Show this code to the Raspberry Pi</h1>
            <img className={'p-2 w-full'} src={code || qr}/>
            <div className={'flex justify-center mt-5 flex-col items-center'}>
                <Oval
                    height={80}
                    width={80}
                    color="#FFD300"
                    secondaryColor={'#FFFFFF'}
                    wrapperStyle=''
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                />
                <p className={'text-white text-2xl mt-2'}>Waiting to pair...</p>
            </div>
        </div>
    )
}