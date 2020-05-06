import React from "react";
import { updateToken } from "../Observables/store";

export default function Header({ socket }) {

  return (
    <header className="header">
      <div className="header__cont">
        <p className="header__title">User: {socket.username}</p>

      </div>
      <div className="header__cont">
        <button className="header__btn" onClick={() => updateToken(null)}>Logout</button>

      </div>
    </header>
  )
}