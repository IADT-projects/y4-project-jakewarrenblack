export const Button = ({ btnText, onClick }) => {
  return (
    <div>
      <button
        onClick={onClick}
        className={
          "my-1 mt-3 w-full rounded-md bg-navyBtn p-4 py-4 text-center text-2xl font-medium text-cyberYellow"
        }
      >
        {btnText}
      </button>
    </div>
  );
};
