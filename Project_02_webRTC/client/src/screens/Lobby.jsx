import { useState, useCallback, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();
  //   console.log(socket);

  const handleSubmit = useCallback(() => {
    socket.emit("room_joined", { email, roomId });
    // console.log(email, roomId);
  }, [email, roomId, socket]);

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, roomId } = data;
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room_joined", handleJoinRoom);
    return () => {
      socket.off("room_joined", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div>
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
            <button type="submit" onClick={() => handleSubmit()}>
              Enter Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
