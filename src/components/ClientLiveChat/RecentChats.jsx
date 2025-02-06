import FacePic from '../../assets/FacePic.svg'
const RecentChats = () => {
    return (
      <div className="flex mt-4 space-x-2">
        {[1, 2, 3, 4].map((id) => (
          <img
            key={id}
            src={FacePic}
            alt="User"
            className="w-[6.5rem] h-[6.5rem] rounded-full"
          />
        ))}
      </div>
    );
  };
  
  export default RecentChats;
  