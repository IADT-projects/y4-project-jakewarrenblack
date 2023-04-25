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

export const CaptureCard = ({ caption, src, count, onClick }) => {
  return (
    /*Couple of pixels of bg image visible at bottom left of card (above caption) if entire bg image is rounded-md */
    <div
      style={{ backgroundImage: `url(${src})` }}
      className={
        "mt-1 flex h-screen h-40 max-h-40 flex-col items-center justify-end rounded-md rounded-b-lg bg-cover bg-center"
      }
    >
      {/* outer div is for bg image */}
      <div
        className={
          "flex w-full items-center justify-center rounded-b-md bg-navyLight"
        }
      >
        <h2 className={"my-1 font-semibold text-white"}>{caption}</h2>
      </div>
    </div>
  );
};
