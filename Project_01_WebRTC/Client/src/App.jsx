import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { SocketProvider } from "./Providers/Socket";
import { PeerProvider } from "./Providers/Peer";
import Room from "./pages/Room";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <PeerProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </PeerProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
