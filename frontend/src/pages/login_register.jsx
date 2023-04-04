import {Input} from "../components/Input";
import {Button} from "../components/Button";
import {useEffect, useState} from "react";
import axios from "axios";
import {useContext} from 'react'
import {AuthContext} from '../utils/AuthContext'

export const LoginRegister = () => {
    const { loadMe} = useContext(AuthContext);

    const [loginSelected, setLoginSelected] = useState(true)

    // when you login with google, the x-auth-token will be set as a cookie by the server,
    // but for normal username/pw login, we send the token as a response in JSON

    const Form = () => {
        const content = () => {
            if(loginSelected){
                return (
                    <>
                        <Input label={'Email'} type={'email'}/>
                        <Input label={'Password'} type={'password'}/>
                        <Button onClick={(e) => {
                            e.preventDefault()
                            window.location.href = 'http://localhost:3001/api/auth/google'
                        }} btnText={'Sign in with Google'}/>
                        <Button onClick={(e) => {
                            e.preventDefault()
                            axios.post(`http://localhost:3001/api/auth/login`, {
                                username: 'miggeldy',
                                password: 'test'
                            }).then(res => {
                                console.log(res)
                                    loadMe(res.data.token)
                            })
                            .catch(e => console.error(e))
                        }} btnText={'Login'}/>
                    </>
                )
            }
            else{
                return (
                    <>

                        <Input label={'First name'} type={'text'}/>
                        <Input label={'Surname'} type={'text'}/>
                        <Input label={'Email'} type={'email'}/>
                        <Input label={'Password'} type={'password'}/>
                        <Button btnText={'Sign Up'}/>
                    </>
                )
            }

        }

        return (
            <form className={'flex flex-col'}>
                <h1 className={'text-white text-4xl font-semibold mb-5'}>{loginSelected ? 'Login' : 'Create an Account'}</h1>
                {content()}
                <p onClick={() => setLoginSelected(!loginSelected)} className={'underline text-cyberYellow mt-3 font-medium'}>{loginSelected ? 'Register' : 'Login'}</p>
            </form>
        )
    }

    return (
        <div className={'px-1'}>
            <Form/>
        </div>
    )
}