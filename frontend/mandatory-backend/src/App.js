import React from 'react';
import './App.css';
import io from "socket.io-client";

import Chat from "./Components/Chat";

function App() {
  let socket = io("localhost:8080");
  return (
    <main className="mainview">
      <Chat socket={socket}></Chat>
    </main>
  );
}

export default App;
