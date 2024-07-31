import { useCallback, useEffect, useState } from "react";
import Peer from "../service/Peer";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  console.log(remoteStream);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`email id: ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  //handle user call

  const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const offer = await Peer.getOffer();
      socket.emit("user_call", { to: remoteSocketId, offer });
      setMyStream(stream);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  }, [remoteSocketId, socket]);
  //incoming call

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log(`incoming call`, from, offer);
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await Peer.getAnswer(offer);
      socket.emit("call_accepted", { to: from, ans });
    },
    [socket]
  );

  // handle accepted call
  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      Peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      await Peer.setLocalDescription(ans);
      console.log("call accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await Peer.getOffer();
    socket.emit("peer_Nego_needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    Peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      Peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
    };
  }, [handleNegotiationNeeded]);

  const handleNegotiation = useCallback(
    async ({ from, offer }) => {
      const ans = await Peer.getAnswer(offer);
      socket.emit("peer_nego_done", { to: from, ans });
    },
    [socket]
  );

  const handleNegotiationFinal = useCallback(async ({ ans }) => {
    await Peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    Peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
      console.log(remoteStream);
    });
  }, []);

  // console.log(remoteStream);

  useEffect(() => {
    socket.on("user_joined", handleUserJoined);
    socket.on("incoming_call", handleIncomingCall);
    socket.on("call_accepted", handleCallAccepted);
    socket.on("peer_Nego_needed", handleNegotiation);
    socket.on("peer_nego_final", handleNegotiationFinal);
    return () => {
      socket.off("user_joined", handleUserJoined);
      socket.off("incoming_call", handleIncomingCall);
      socket.off("call_accepted", handleCallAccepted);
      socket.off("peer_Nego_needed", handleNegotiation);
      socket.off("peer_nego_final", handleNegotiationFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegotiation,
    handleNegotiationFinal,
  ]);

  return (
    <div>
      <h1>Room Page</h1>
      <h4>{remoteSocketId ? "connected" : "Not in the room"}</h4>
      {myStream && <button onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="300px"
            width="200px"
            url={myStream}
          />
        </>
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="300px"
            width="200px"
            url={remoteStream}
          />
        </>
      )}
    </div>
  );
};

export default Room;
