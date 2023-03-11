import {Oval} from 'react-loader-spinner'
import qr from '../Assets/qr_code.jpg'
import {useEffect, useState} from "react";
import axios from "axios";

export const Pairing = () => {
    const [code, setCode] = useState()

    useEffect(() => {
        axios.get(`http://localhost:3001/api/pair/`).then((res) => {
            setCode(res.data)
        }).catch((e) => {
            console.log(e)
        })
    }, [])

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