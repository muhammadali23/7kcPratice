import React, { createContext, useMemo } from "react";
import { useContext } from "react";
import { io } from "socket.io-client";

const socketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(socketContext);
  return socket;
};
const SocketProvider = (props) => {
  const socket = useMemo(() => io("localhost:8000"), []);
  return (
    <div>
      <socketContext.Provider value={socket}>
        {props.children}
      </socketContext.Provider>
    </div>
  );
};

export default SocketProvider;
