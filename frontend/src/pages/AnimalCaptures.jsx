import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import TitleCard from '../../components/TitleCard';
import {useAuth} from "../../utils/useAuth";
import {Button} from "../components/Button";
import {CaptureCard} from "../components/CaptureCard";

export const AnimalCaptures = (props) => {
    const { animal } = useParams();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/titles/id/${id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                console.log(response.data);
                //setTitle(response.data);
            })
            .catch((err) => {
                console.error(err);
                // unauthorised
                // if(err.response.status == 401) logout()
            });
    }, []);

    if(!title) return "Loading...";

    return (
        <div className={'w-full flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto p-2 bg-navy'}>
            <div className={'[&>*]:w-full flex flex-col'}>
                <h1 className={'text-white text-3xl text-center font-medium'}>Captures</h1>

                <div className={'grid grid-cols-2 gap-1 w-full'}>
                    {/* will iterate over animal images */}
                    {/*{labels.map(({src, name}) => <Link to={'/captures/:animal'} element={<AnimalCaptures/>}><CaptureCard src={src} caption={name}/></Link>)}*/}
                </div>
            </div>
        </div>
    );
};