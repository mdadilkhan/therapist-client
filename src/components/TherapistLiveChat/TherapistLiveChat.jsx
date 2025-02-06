import React, { useState } from 'react'

import ChatList from "./ChatList";
import GoLiveToggle from "./GoLiveToggle";
import EmptyState from "./EmptyState";
import ChatWindow from './ChatWindow'

const TherapistLiveChat = () => {
  const [isLive, setIsLive] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [searchUser, setSearchUser] = useState('');  // State to store search input

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchUser(e.target.value);
  };

  return (
    <div className="flex h-[91vh]">
      {/* Sidebar */}
      <div className="w-1/3 p-4 border-r bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[2.4rem] font-bold">Live Chat</h2>
          <GoLiveToggle isLive={isLive} setIsLive={setIsLive} />
        </div>
        
        {/* Search Bar */}
        <input 
          type="text" 
          placeholder="Find Client" 
          className="w-full py-2 border h-[4.4rem] mb-4 rounded-3xl px-6"
          value={searchUser}
          onChange={handleSearchChange}  // Handle input change
        />

        {/* Recent Chats - Pass searchTerm to ChatList */}
        <ChatList 
          isLive={isLive} 
          setActiveChat={setActiveChat} 
          searchUser={searchUser}  // Pass searchTerm as a prop
        />
      </div>

      {/* Chat Window */}
      <div className="w-2/3 flex items-center justify-center">
        {!isLive ? (
          <EmptyState />
        ) : activeChat ? (
          <ChatWindow chat={activeChat} />
        ) : (
          <p className="text-gray-500">Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
}

export default TherapistLiveChat;
