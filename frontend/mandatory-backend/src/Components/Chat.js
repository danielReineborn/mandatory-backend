import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { Redirect } from "react-router-dom";

import { capLetter } from "../Utils";
import Sidebar from "./Sidebar";
import { token$ } from '../Observables/store';

export default function Chat({ socket }) {
  const [msg, updateMsg] = useState([]);
  const [value, updateValue] = useState("");
  const [chatRoom, updateChatRoom] = useState("general");
  const [token, updateToken] = useState(token$.value);


  useEffect(() => {
    const subscription = token$.subscribe(updateToken);
    socket.username = localStorage.getItem("user");
    return () => {
      subscription.unsubscribe();
    }
  }, [])

  useEffect(() => {
    axios.get(`/messages/${chatRoom}`)
      .then((res) => {
        let data = res.data;
        updateMsg(data);
        console.log(data);
        return res;
      })
      .catch(e => {
        console.error(e);
      })

  }, [chatRoom])

  useEffect(() => {
    socket.on("message", data => {
      console.log(data);
      //copy msg and use copy not real state.
      let msgCopy = [...msg];
      msgCopy.push(data);
      updateMsg(msgCopy);

    })
    return () => {
      socket.off("message");
    }
  }, [msg, chatRoom])

  const myRef = useRef()

  function onChange(e) {
    let value = e.target.value;
    updateValue(value);
  }

  function roomSwitch(room) {
    console.log(chatRoom)
    socket.emit("room_switch", room, (data) => {
      console.log(data);
    });
    updateChatRoom(room);
  }

  function onSubmit(e) {
    e.preventDefault();

    let newMessage = {
      username: socket.username,
      msg: value,
      room: chatRoom,
    };
    socket.emit("new_message", newMessage, (id) => {
      newMessage._id = id;
      console.log(newMessage);
      let messages = [
        ...msg,
        newMessage,
      ]
      updateMsg(messages);
    });



    updateValue("");
  }

  if (!token) {
    console.log("this happens")
    return <Redirect to="/login" />
  }
  return (
    <section className="chatview">
      <div className="chatview__chat">
        <h1>{chatRoom}</h1>
        <div className="messages">
          {msg ? msg.map((x) => {
            return (
              <div key={x._id} className="chat__listitem">
                <p id={x._id}>{x.username}: {x.msg}</p>
              </div>
            )
          }) : <p>Loading...</p>}
          <form onSubmit={onSubmit} action="">
            <input value={value} onChange={onChange} type="text" name="chat" id="chat" />
            <button type="submit">Send</button>
          </form>
        </div>

      </div>
      <Sidebar socket={socket} changeRoom={roomSwitch} />

    </section>

  )
}