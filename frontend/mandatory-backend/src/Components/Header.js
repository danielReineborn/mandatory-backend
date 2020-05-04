import React from "react";
import { updateToken } from "../Observables/store";

export default function Header({ socket }) {

  return (
    <header className="header">
      <div className="header__cont">
        <p className="header__title">Logged in as: {socket.username}</p>

      </div>
      <div className="header__cont">
        <button onClick={() => updateToken(null)} className="header__btn">Logout</button>

      </div>
    </header>
  )
}