import {Input} from "../components/Input";
import {Button} from "../components/Button";
import {useEffect, useState} from "react";
import axios from "axios";

export const LoginRegister = () => {

    const google = () => {
        window.open('http://localhost:3001/api/auth/google')
    }

    const [loginSelected, setLoginSelected] = useState(true)

    const Form = () => {
        const content = () => {
            if(loginSelected){
                return (
                    <>
                        <Input label={'Email'} type={'email'}/>
                        <Input label={'Password'} type={'password'}/>
                        <Button onClick={() => google()} btnText={'Sign in with Google'}/>
                        <Button btnText={'Login'}/>
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