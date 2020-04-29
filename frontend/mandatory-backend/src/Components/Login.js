import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { userName$ } from "../Observables/store";

export default function Login({ onLogin }) {

  const [userName, updateName] = useState("");

  useEffect(() => {
    const subscription = userName$.subscribe(updateName);
    return () => {
      subscription.unsubscribe();
    }
  }, [])

  function onSubmit(e) {

    //
  }
  return (
    <section className="loginScreen">
      <div className="login__cont">
        <h1 className="form__title">Login</h1>

        <form onSubmit={onSubmit} action="">
          <label htmlFor="username">Choose a username:</label>
          <input type="text" name="username" id="username" />
        </form>

      </div>
    </section>
  )
}