import React, { useMemo, useEffect, useState, useCallback } from "react";

const peerContext = React.createContext(null);

export const usePeer = () => React.useContext(peerContext);

export const PeerProvider = (props) => {
  const [remoteStream, SetRemoteStream] = useState(null);
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      }),
    []
  );

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAns = async (ans) => {
    await peer.setRemoteDescription(ans);
  };

  const sendStream = async (stream) => {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
  };

  const handleRemoteStream = useCallback(
    (e) => {
      const streams = e.streams;
      SetRemoteStream(streams[0]);
    },
    [peer]
  );

  const handleNegotiation = useCallback((e) => {
    console.log("oops negotiation needed");
  });

  useEffect(() => {
    peer.addEventListener("track", handleRemoteStream);
    peer.addEventListener("negotiationNeeded", handleNegotiation);

    return () => {
      peer.removeEventListener("track", handleRemoteStream);
      peer.removeEventListener("negotiationNeeded", handleNegotiation);
    };
  }, [handleRemoteStream, peer]);

  return (
    <div>
      <peerContext.Provider
        value={{
          peer,
          createOffer,
          createAnswer,
          setRemoteAns,
          sendStream,
          remoteStream,
        }}
      >
        {props.children}
      </peerContext.Provider>
    </div>
  );
};
