import { SocketContext } from "./socketProvider";
import { useContext } from "react";

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};