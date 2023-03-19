export const Button = ({btnText, onClick}) => {
    return (
        <div>
            <button onClick={onClick} className={'bg-navyBtn text-cyberYellow rounded-md py-4 font-medium text-center w-full my-1 text-2xl mt-3'}>
                {btnText}
            </button>
        </div>
    )
}