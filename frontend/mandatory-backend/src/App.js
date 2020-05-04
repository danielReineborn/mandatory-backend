import React from 'react';
import './App.css';
import io from "socket.io-client";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Chat from "./Components/Chat";
import Login from "./Components/Login";

function App() {
  let socket = io("localhost:8080");
  return (
    <Router>
      <main className="mainview">
        <Route
          path="/login"
          render={(props) => <Login {...props} socket={socket} />}
        />
        <Route
          exact path="/"
          render={(props) => <Chat {...props} socket={socket} />}
        />
      </main>

    </Router>
  );
}

export default App;
