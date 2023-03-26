import {Input} from "../components/Input";
import {Button} from "../components/Button";
import axios from "axios";
import React from "react";
import {CaptureCard} from "../components/CaptureCard";

import bear from '../Assets/animals/bear.jpg'
import cat from '../Assets/animals/cat.jpg'
import crow from '../Assets/animals/crow.jpg'
import deer from '../Assets/animals/deer.jpg'
import dog from '../Assets/animals/dog.jpg'
import hedgehog from '../Assets/animals/hedgehog.jpg'
import raccoon from '../Assets/animals/raccoon.jpg'
import squirrel from '../Assets/animals/squirrel.jpg'
import rabbit from '../Assets/animals/rabbit.jpg'
import {Link} from "react-router-dom";

export const Captures = () => {
    const labels = [
        {src: bear, name:'Bear'},
        {src: crow, name:'Crow'},
        {src: deer, name:'Deer'},
        {src: hedgehog, name:'Hedgehog'},
        {src: rabbit, name:'Rabbit'},
        {src: raccoon, name:'Raccoon'},
        {src: squirrel, name:'Squirrel'},
        {src: cat, name:'Cat'},
        // {src: dog, name:'Dog'},
    ]

    return (
        <div className={'w-full flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto p-2 bg-navy'}>
            <div className={'[&>*]:w-full flex flex-col'}>
                <h1 className={'text-white text-3xl text-center font-medium'}>Captures</h1>
                <h1 className={'text-white text-base text-center mb-5 font-light'}>This week's captures</h1>
                <div className={'mt-2 mb-2'}>
                    <Button onClick={() => {}} btnText={'Animal Spotted'}/>
                </div>

                <div className={'grid grid-cols-2 gap-1 w-full'}>
                    {labels.map(({src, name}) => <Link to={'/captures/:animal'} element={<AnimalCaptures/>}><CaptureCard src={src} caption={name}/></Link>)}
                </div>
            </div>
        </div>
    )
}