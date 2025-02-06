// import React, { useState } from 'react'

// import ChatList from "../TherapistLiveChat/ChatList";
// import GoLiveToggle from "../TherapistLiveChat/GoLiveToggle";
// import EmptyState from "../TherapistLiveChat/EmptyState";
// import ChatWindow from '../TherapistLiveChat/ChatWindow'

// const ClientLiveChat = () => {
//   const [isLive, setIsLive] = useState(false);
//   const [activeChat, setActiveChat] = useState(null);
//   const [searchUser, setSearchUser] = useState('');  // State to store search input

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchUser(e.target.value);
//   };

//   return (
//     <div className="flex h-[91vh]">
//       {/* Sidebar */}
//       <div className="w-1/3 p-4 border-r bg-white">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-[2.4rem] font-bold">Live Chat</h2>

//         </div>
        
//         {/* Search Bar */}
//         <input 
//           type="text" 
//           placeholder="Find Client" 
//           className="w-full py-2 border h-[4.4rem] mb-4 rounded-3xl px-6"
//           value={searchUser}
//           onChange={handleSearchChange}  // Handle input change
//         />

//         {/* Recent Chats - Pass searchTerm to ChatList */}
//         <ChatList 
//           isLive={isLive} 
//           setActiveChat={setActiveChat} 
//           searchUser={searchUser}  // Pass searchTerm as a prop
//         />
//       </div>

   
//     </div>
//   );
// }

// export default ClientLiveChat;



import { useState } from "react";
import SearchBar from "./SearchBar";
import RecentChats from "./RecentChats";
import TherapistList from "./TherapistList";
import ChatWindow from "./ChatWindow";
import NotLive from "../../assets/NotLive.svg"


const therapistsData = [
  {
    id: 1,
    name: "Shruti Ramakrishnan",
    specialization: "M.A. Psychology, B.A. (Hons.)",
    experience: "10 Years",
    price: "₹5 / min",
    available: true,  // true = available, false = busy
  },
  {
    id: 2,
    name: "Md Adil Khan",
    specialization: "M.A. Psychology, B.A. (Hons.)",
    experience: "10 Years",
    price: "₹5 / min",
    available: true,  // Busy
  },
  {
    id: 3,
    name: "Sushmita Bhowmic",
    specialization: "M.A. Psychology, B.A. (Hons.)",
    experience: "10 Years",
    price: "₹0 / min",
    available: false,  // Busy
  }
];

const CLientLiveChat = () => {
  const [therapists, setTherapists] = useState(therapistsData);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  console.log(searchQuery);
  
  const handleSelectTherapist = (therapist) => {
    if (therapist.available) {
      setSelectedTherapist(therapist);
    }
  };

  const filteredTherapists = therapists.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[91vh]">
      {/* Left Sidebar */}
      <div className="w-1/3 p-4 border-r">
        <h2 className="text-xl font-semibold">Live Chat</h2>
        <SearchBar onSearchChange={setSearchQuery} />
        <RecentChats />
        <TherapistList
          therapists={filteredTherapists}
          onSelectTherapist={handleSelectTherapist}
        />
      </div>

      {/* Right Side Chat Window */}
      <div className="w-2/3 p-6">
        {selectedTherapist ? (
          <ChatWindow therapist={selectedTherapist} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <img src={NotLive} alt="Placeholder" />
            <p className="text-gray-600">You haven't selected a therapist yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CLientLiveChat;
