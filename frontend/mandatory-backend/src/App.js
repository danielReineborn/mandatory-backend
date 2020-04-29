import React from 'react';
import './App.css';
import io from "socket.io-client";
import { Router } from "react-router-dom";

import Chat from "./Components/Chat";
import Login from "./Components/Login";

function App() {
  let socket = io("localhost:8080");
  return (
    <Router>
      <main className="mainview">
        <Chat socket={socket}></Chat>
      </main>

    </Router>
  );
}

export default App;
