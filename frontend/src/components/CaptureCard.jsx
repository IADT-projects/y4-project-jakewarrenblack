// export const CaptureCard = ({caption, src, count, onClick}) => {
//     return (
//
//         <div className={'bg-navyLight rounded-md mt-1'}>
//             {/* outer div is for bg image */}
//             <div className={''}>
//                 <span>{count}</span>
//                 <img src={src} alt={caption}/>
//             </div>
//             <div className={'bg-navyLight relative flex items-center justify-center p-2'}>
//                 <h2 className={'text-white'}>{caption}</h2>
//             </div>
//         </div>
//     )
// }


export const CaptureCard = ({caption, src, count, onClick}) => {
    return (

        /*Couple of pixels of bg image visible at bottom left of card (above caption) if entire bg image is rounded-md */
        <div style={{backgroundImage:`url(${src})`}} className={'rounded-md rounded-b-lg h-screen h-40 bg-cover mt-1 flex flex-col justify-end items-center'}>
            {/* outer div is for bg image */}
            <div className={'bg-navyLight w-full flex justify-center items-center rounded-b-md'}>
                <h2 className={'text-white my-1 font-semibold'}>{caption}</h2>
            </div>
        </div>
    )
}