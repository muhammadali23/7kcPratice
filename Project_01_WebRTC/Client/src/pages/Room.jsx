import React from "react";
import { useSocket } from "../Providers/Socket";
import { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import { usePeer } from "../Providers/Peer";

const Room = () => {
  const { socket } = useSocket();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream,
  } = usePeer();

  const [myStream, setMyStream] = useState(null);

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("new user joined room ", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("incoming call from", from, offer);
      const ans = await createAnswer(offer);
      socket.emit("call-accepted", { emailId: offer, ans });
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("call got accepted", ans);
      await setRemoteAns(ans);
      sendStream(myStream);
    },
    [setRemoteAns]
  );

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setMyStream(stream);
  }, []);

  useEffect(() => {
    socket.on("user_joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    return () => {
      socket.off("user_joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [handleNewUserJoined, socket]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <div>
      <h1>Hey, you are in room page</h1>
      <button onClick={(e) => sendStream(myStream)}>send my stream</button>
      <ReactPlayer url={myStream} playing muted />
      <ReactPlayer url={remoteStream} playing />
    </div>
  );
};

export default Room;
