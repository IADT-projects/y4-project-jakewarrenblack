import { Oval } from "react-loader-spinner";

export const Loader = () => {
  return (
    <Oval
      height={80}
      width={80}
      color="#FFD300"
      secondaryColor={"#FFFFFF"}
      wrapperStyle=""
      wrapperClass="flex w-full justify-center items-center h-min"
      visible={true}
      ariaLabel="oval-loading"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  );
};
