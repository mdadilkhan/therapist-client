import ChatItem from "./ChatItem";
import FacePic from '../../assets/FacePic.svg'
const ChatList = ({ isLive, setActiveChat,searchUser }) => {
  const chats = [
    { id: 1, name: 'John Doe', message: 'Hello!' },
    { id: 2, name: 'Jane Smith', message: 'How are you?' },
    { id: 3, name: 'Bob Brown', message: 'Good morning' },
    // Add more chat objects
  ];


  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="">
      <h3 className="text-md font-semibold mb-2">Recent Chats</h3>
      <div className="flex gap-4 mb-4">
        {chats.slice(0, 5).map(chat => (
          <img 
            key={chat.id} 
            src={FacePic} 
            alt={chat.name} 
            className="w-[6.5rem] h-[6.5rem] rounded-full"
          />
        ))}
      </div>

      <h3 className="text-md font-semibold mb-2">Messages</h3>
      {filteredChats.length === 0 ? (
        <div className="h-[10rem]  flex justify-center items-center">
          <p className="text-gray-500">No users found</p>

        </div>

      ) : (
        filteredChats.map(chat => (
          <ChatItem key={chat.id} chat={chat} onClick={() => setActiveChat(chat)} isLive={isLive} />
        ))
      )}
    </div>
  );
};

export default ChatList;
