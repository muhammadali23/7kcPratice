import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useSocket } from "../Providers/Socket";

const Home = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleRoomId = useCallback(
    ({ roomId }) => {
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("joined_room", handleRoomId);
    return () => {
      socket.off("joined_room", handleRoomId);
    };
  }, [socket]);

  const handleRoomJoin = () => {
    console.log("object");
    socket.emit("join_room", { emailId: email, roomId: roomId });
  };

  return (
    <div className="HomePage_Container">
      <div className="Inputs_Container">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Enter your email"
        />
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          placeholder="Enter Room code"
        />
        <div className="btn-container">
          <button onClick={() => handleRoomJoin()}>Enter Room</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
