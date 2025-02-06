const GoLiveToggle = ({ isLive, setIsLive }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <span className="mr-2 text-[#181126] font-normal text-[2rem] ">
        Go Live
      </span>
      <input
        type="checkbox"
        className="hidden"
        checked={isLive}
        onChange={() => setIsLive(!isLive)}
      />
      <div
        className={`w-[5rem] h-[2.4rem] flex items-center bg-[#E6E0E9] rounded-full transition ${
          isLive ? "bg-[#6750A4]" : "bg-[#E6E0E9]"
        }`}
      >
        <div
          className={`w-[2rem] h-[2rem] rounded-full shadow-md transform transition ${
            isLive
              ? "translate-x-[2.8rem] bg-[#EADDFF]"
              : "translate-x-1 bg-[#49454F]"
          }`}
        />
      </div>
    </label>
  );
};

export default GoLiveToggle;
