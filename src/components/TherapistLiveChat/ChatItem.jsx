import FacePic from "../../assets/FacePic.svg";
import clsx from "clsx";
const ChatItem = ({ chat, onClick, isLive }) => {
  console.log("uslive>>>", isLive);

  return (
    <>
      <div
        className={clsx(
          "flex items-center justify-between py-2 hover:bg-gray-100 p-2 rounded-lg",
          { "cursor-pointer": isLive, "cursor-not-allowed": !isLive }
        )}
        onClick={onClick}
      >
        <div className="flex items-center space-x-3 ">
          <img
            src={FacePic}
            alt={chat.name}
            className="w-[5.2rem] h-[5.2rem] rounded-full"
          />
          <div>
            <h4 className="font-semibold">{chat.name}</h4>
            <p className="text-gray-500 text-sm">{chat.message}</p>
          </div>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p className="font-normal text-[8px]">{chat.date}</p>
          <p className="font-bold text-[1.2rem] text-[#000000]">{chat.time}</p>
          <p className="font-normal text-[8px]">{chat.duration}</p>
        </div>
      </div>
      <div className=" h-[0.5px] bg-[#C2C0C0]" />
    </>
  );
};

export default ChatItem;
