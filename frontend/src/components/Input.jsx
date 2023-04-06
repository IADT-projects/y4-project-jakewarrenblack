export const Input = ({type, label, handleForm, value, name}) => {
    return (
        <div className={'flex flex-col mb-4'}>
            {/* uppercase first letter */}
            <label className={'text-navyLighter font-semibold'} htmlFor={label}>{label[0].toUpperCase() + label.slice(1)}</label>
            <input name={name} value={value} onChange={handleForm} className={'bg-navyLight py-4 rounded-md mt-1 text-white pl-2 text-xl'} label={label} type={type}></input>
        </div>
    )
}