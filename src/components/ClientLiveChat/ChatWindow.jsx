import { useState, useRef, useEffect } from "react";
import FacePic from "../../assets/FacePic.svg";

const ChatWindow = ({ therapist }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey!", sender: "client" },
    { id: 2, text: "Hello, how can I help you?", sender: "therapist" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    // Add new message to chat
    setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: "client" }]);
    
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center border-b pb-2 mb-4">
        <div className="relative">
          <img src={FacePic} alt="Therapist" className="w-12 h-12 rounded-full" />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
              therapist.available ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
        <div className="ml-4">
          <h4 className="font-semibold">{therapist.name}</h4>
          <p className="text-sm text-gray-500">{therapist.specialization}</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-md max-w-[70%] ${
              msg.sender === "client"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black"
            } mb-2`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="border-t pt-2 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border rounded-lg focus:outline-none"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
