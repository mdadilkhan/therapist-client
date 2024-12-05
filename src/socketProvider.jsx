import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
export const SocketContext = createContext();
const SOCKET_URL = "https://therapist-server.onrender.com";

export const SocketProvider = (props) => {
  const token = useSelector((state) => state.userDetails?.token);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (token && !socket) {
      const newSocket = socketIO.connect(SOCKET_URL, {
        query: { token },
      });
      setSocket(newSocket);
    }
  }, [token, socket]);
  console.log(socket, "in Socket provide")
  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
}