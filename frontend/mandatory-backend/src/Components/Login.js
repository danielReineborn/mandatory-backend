import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { updateToken, token$ } from "../Observables/store";

export default function Login({ socket }) {

  const [token, updateTok] = useState("");
  const [userName, updateUserName] = useState("");

  useEffect(() => {
    const subscription = token$.subscribe(updateTok);
    socket.on("token", (data) => {
      console.log(data);
      updateToken(data.id);
      localStorage.setItem("token", token$.value);
    })

    return () => {
      socket.off("token");
      subscription.unsubscribe();
    }
  }, [])

  function onSubmit(e) {
    e.preventDefault();

    socket.emit("adduser", userName)
    socket.username = userName;
    console.log(socket.username);
    localStorage.setItem("user", userName);

  }

  function onChange(e) {
    let value = e.target.value;
    updateUserName(value);
  }
  if (token) {
    return <Redirect to="/" />
  }
  return (
    <section className="loginScreen">
      <div className="login__cont">
        <h1 className="login__title">Login</h1>
        <div className="form__cont">

          <form autoComplete="off" className="login__form" onSubmit={onSubmit} action="">
            <input placeholder="Choose a username" className="login__input" value={userName} onChange={onChange} type="text" name="username" id="username" />
          </form>
        </div>
        <footer>
          <p className="login__foot">Powered by socket.IO</p>

        </footer>
      </div>
    </section>
  )
}