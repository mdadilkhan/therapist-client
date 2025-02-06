import { useState } from "react";
import FacePic from '../../assets/FacePic.svg'
const ChatWindow = ({ chat }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey!", sender: "client" },
    { id: 2, text: "Hello, how can I help you?", sender: "therapist" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: "therapist" }]);
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line and send message
      sendMessage();
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex items-center border-b pb-2 mb-2">
        <img src={FacePic} alt={chat.name} className="w-10 h-10 rounded-full" />
        <h2 className="ml-3 font-semibold">{chat.name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`p-2 my-1 rounded-lg w-max ${msg.sender === "therapist" ? "bg-blue-500 text-white self-end" : "bg-gray-200"}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="border-t pt-2 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border rounded-lg focus:outline-none"
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
