import {Input} from "../components/Input";
import {Button} from "../components/Button";
import axios from "axios";
import React from "react";
import {CaptureCard} from "../components/CaptureCard";

export const Captures = () => {

    return (
        <div className={'w-full flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto p-2 bg-navy min-h-screen'}>
            <div className={'[&>*]:w-full flex flex-col'}>
                <h1 className={'text-white text-3xl text-center font-medium'}>Captures</h1>
                <h1 className={'text-white text-base text-center mb-5 font-light'}>This week's captures</h1>
                <div className={'mt-2 mb-2'}>
                    <Button onClick={() => {}} btnText={'Animal Spotted'}/>
                </div>

                <div className={'grid grid-cols-2 gap-1 w-full'}>
                    {Array.from({length: 6}).map(() => <CaptureCard src={'https://picsum.photos/200'} caption={'Caption'}/>)}
                </div>
            </div>
        </div>
    )
}