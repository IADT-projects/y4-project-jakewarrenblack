export const Input = ({type, label}) => {
    return (
        <div className={'flex flex-col mb-4'}>
            {/* uppercase first letter */}
            <label className={'text-navyLighter font-semibold'} htmlFor={label}>{label[0].toUpperCase() + label.slice(1)}</label>
            <input className={'bg-navyLight py-4 rounded-md mt-1'} label={label} type={type}></input>
        </div>
    )
}