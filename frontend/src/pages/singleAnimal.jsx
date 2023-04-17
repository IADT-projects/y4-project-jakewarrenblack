import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../utils/AuthContext";

export const SingleAnimal = (props) => {
    const { animal } = useParams();
    const {token} = useContext(AuthContext)
    const [images, setImages] = useState([])

    // make request to userFolder/animal

    useEffect(() => {
        axios.get(`http://localhost:5000/api/getimages?folderName=${animal}`, {headers: {'x-auth-token': token}}).then((res)=> {
            console.log('Res: ', res)
            setImages(res.data.map(result => result.url))
        })
    }, [])


    return (
        <div className={'w-full flex justify-center items-center flex-col w-[800px] [&>*]:w-full m-auto p-2 bg-navy'}>
            <div className={'[&>*]:w-full flex flex-col'}>
                <h1 className={'text-white text-3xl text-center font-medium'}>{animal}</h1>

                <div className={'grid grid-cols-2 gap-1 w-full'}>
                    {/* will iterate over animal images */}
                    {/*{images.map((image) => <Link to={'/captures/:animal'} element={<SingleAnimal/>}><CaptureCard src={src} caption={name}/></Link>)}*/}
                    {
                        images.map(image => <img src={image}/>)
                    }

                </div>
            </div>
        </div>
    );
};