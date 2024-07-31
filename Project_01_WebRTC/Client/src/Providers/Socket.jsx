import React, { useMemo } from "react";
import { io } from "socket.io-client";

const socketContext = React.createContext(null);

export const useSocket = () => {
  return React.useContext(socketContext);
};

export const SocketProvider = (props) => {
  const socket = io("http://localhost:8010");
  return (
    <div>
      <socketContext.Provider value={{ socket }}>
        {props.children}
      </socketContext.Provider>
    </div>
  );
};
