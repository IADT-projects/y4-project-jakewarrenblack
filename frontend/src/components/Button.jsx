const Button = ({btnText}) => {
    return (
        <div>
            <button className={'bg-navyBtn text-cyberYellow rounded-sm p-2 font-medium text-center w-full my-1'}>
                {btnText}
            </button>
        </div>
    )
}

export default Button