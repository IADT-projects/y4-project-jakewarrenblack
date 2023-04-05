import {Input} from "../components/Input";
import {Button} from "../components/Button";
import {useEffect, useState} from "react";
import {useContext} from 'react'
import {AuthContext} from '../utils/AuthContext'

export const LoginRegister = () => {
    const [loginSelected, setLoginSelected] = useState(true)
    const {something, loginUserWithEmail, ping} = useContext(AuthContext);

    const Form = () => {
        const content = () => {
            if(loginSelected){
                return (
                    <>
                        <Input label={'Email'} type={'email'}/>
                        <Input label={'Password'} type={'password'}/>
                        <Button onClick={(e) => {
                            e.preventDefault()
                            window.location.href = 'http://localhost:5000/api/auth/google'
                        }} btnText={'Sign in with Google'}/>
                        <Button onClick={async (e) => {
                            e.preventDefault()
                            //
                            loginUserWithEmail({
                                username: 'miggeldy',
                                password: 'test'
                            }, location)

                            //ping()

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