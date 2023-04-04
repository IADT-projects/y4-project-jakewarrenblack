import {Input} from "../components/Input";
import {Button} from "../components/Button";
import {useEffect, useState} from "react";
import axios from "axios";

export const LoginRegister = () => {
    const [loginSelected, setLoginSelected] = useState(true)

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
                                email: 'test@teeee.com',
                                password: 'abcd'
                            }).then(r => console.log(r))
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