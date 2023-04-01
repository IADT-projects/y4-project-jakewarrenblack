import {Input} from "../components/Input";
import {Button} from "../components/Button";
import {useEffect} from "react";
import axios from "axios";

export const Login = () => {


    return (
        <div className={'px-1'}>
            <form className={'flex flex-col'}>
                <h1 className={'text-white text-4xl font-semibold mb-5'}>Login</h1>
                <Input label={'email'} type={'email'}/>
                <Input label={'password'} type={'password'}/>
                <Button btnText={'Login'}/>
                <Button onClick={() => {
                    console.log('LOGIN CLICk')
                    axios.get('http://localhost:3001/api/auth/login/federated/google').then((res) => {
                        console.log(res)
                    }).catch((e) => console.error(e))

                }} btnText={'Sign in with Google'}/>
            </form>
            <p className={'underline text-cyberYellow mt-3 font-medium'}>Create an account</p>
        </div>
    )
}