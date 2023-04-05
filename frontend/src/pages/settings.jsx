import {Input} from "../components/Input";
import {Button} from "../components/Button";
import {Link, useNavigate} from "react-router-dom";
import Markdown from 'markdown-to-jsx';
import React, {useContext} from 'react';
import { render } from 'react-dom';
import {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import {AuthContext} from '../utils/AuthContext'
import axios from "axios";
import Cookies from 'js-cookie'

const PrivacyPolicy = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [privacyPolicy, setPrivacyPolicy] = useState('')

    // load markdown
    useEffect(() => {
        import("../Assets/markdown/privacy-policy.md").then(res => {
            fetch(res.default)
                .then(response => response.text())
                .then(text => setPrivacyPolicy(text))
        })
    })

    // styling for the markdown
    const options = {
        overrides: {
            h1: { component: 'h1', props: { className: 'text-white text-4xl font-bold mb-4' } },
            h2: { component: 'h2', props: { className: 'text-white text-3xl font-bold mb-4' } },
            h3: { component: 'h3', props: { className: 'text-white text-2xl font-bold mb-4' } },
            h4: { component: 'h4', props: { className: 'text-white text-xl font-bold mb-4' } },
            h5: { component: 'h5', props: { className: 'text-white text-lg font-bold mb-4' } },
            h6: { component: 'h6', props: { className: 'text-white text-base font-bold mb-4' } },
            p: { component: 'p', props: { className: 'text-white text-base mb-4' } },
            li: { component: 'li', props: { className: 'text-white text-base mb-4' } },
        },
    };



    return (
        <>
            {
                isOpen ?  (
                    <div className={'mb-20'}>
                        <span className={'text-white hover:cursor-pointer absolute right-2'} onClick={() => setIsOpen(false)}>✖</span>
                        <div className='h-full'>
                            <Markdown options={options}>{privacyPolicy}</Markdown>
                        </div>
                    </div>
                ) : <h3 className={'text-white hover:cursor-pointer'} onClick={() => setIsOpen(true)}>Privacy policy</h3>
            }
        </>
    )
}

export const Settings = () => {
    const {user, setUser, clearAllValues} = useContext(AuthContext)
    const navigate = useNavigate()

    return (
        <div className={'px-1 bg-navy'}>
            <h1 className={'text-white'}>Settings</h1>
            {user && <div className={'flex items-center'}>
                {user.photo && <img className={'h-10'} src={`${user.photo}`}/>}
                <h1 className={'text-white ml-2'}>{user.username}</h1>
            </div>}
            <br/>
            <PrivacyPolicy/>
            <h1 className={'text-white'} onClick={() => {
                // Clear the context first
                clearAllValues()
                axios.get(`http://localhost:5000/api/auth/logout`).then((res) => {
                    navigate('/')
                })
            }}>Logout</h1>

        </div>
    )
}