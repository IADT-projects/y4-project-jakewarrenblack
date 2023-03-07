import {Input} from "../components/Input";
import {Button} from "../components/Button";

export const Register = () => {

    return (
        <div className={'px-1'}>
            <form className={'flex flex-col'}>
                <h1 className={'text-white text-4xl font-semibold mb-5'}>Create an account</h1>
                <Input label={'First name'} type={'text'}/>
                <Input label={'Surname'} type={'text'}/>
                <Input label={'Email'} type={'email'}/>
                <Input label={'Password'} type={'password'}/>
                <Button btnText={'Login'}/>
            </form>
            <p className={'underline text-cyberYellow mt-3 font-medium'}>Continue to device pairing</p>
        </div>
    )
}