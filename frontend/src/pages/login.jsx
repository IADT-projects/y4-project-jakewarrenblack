import {Input} from "../components/Input";
import {Button} from "../components/Button";

export const Login = () => {

    return (
        <div className={'px-1'}>
            <form className={'flex flex-col'}>
                <h1 className={'text-white text-4xl font-semibold mb-5'}>Login</h1>
                <Input label={'email'} type={'email'}/>
                <Input label={'password'} type={'password'}/>
                <Button btnText={'Login'}/>
            </form>
            <p className={'underline text-cyberYellow mt-3 font-medium'}>Create an account</p>
        </div>
    )
}