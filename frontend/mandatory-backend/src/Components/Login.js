import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { updateToken, token$ } from "../Observables/store";

export default function Login({ socket }) {

  const [token, updateTok] = useState("");
  const [userName, updateUserName] = useState("");

  useEffect(() => {
    const subscription = token$.subscribe(updateTok);
    socket.on("message", (data) => {
      console.log(data);
      updateToken(data.id);
      updateTok(data.id)
      localStorage.setItem("token", token$.value);
    })

    return () => {
      socket.off("message");
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
        <h1 className="form__title">Login</h1>

        <form onSubmit={onSubmit} action="">
          <label htmlFor="username">Choose a username:</label>
          <input value={userName} onChange={onChange} type="text" name="username" id="username" />
        </form>

      </div>
    </section>
  )
}