import React, { useEffect, useState } from 'react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import { capLetter } from "../Utils";
import Sidebar from "./Sidebar";

export default function Chat({ socket }) {
  const [msg, updateMsg] = useState([]);
  const [value, updateValue] = useState("");
  const [chatRoom, updateChatRoom] = useState("general");


  useEffect(() => {
    //socket.emit("adduser", "Daniel"); //Varje gång detta görs, joinas "general" på servern. INTE BRA.
    axios.get("/messages")
      .then((res) => {
        let data = res.data[chatRoom];
        updateMsg(data);
        console.log("updateMsg");
        return res;
      })

  }, [chatRoom])

  useEffect(() => {
    socket.on("message", (data) => {
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
      username: "Daniel",
      msg: value,
      room: chatRoom,
      id: uuidv4(),
    };

    let messages = [
      ...msg,
      newMessage,
    ]
    updateMsg(messages);


    socket.emit("new_message", newMessage);
    updateValue("");
  }

  return (
    <section className="chatview">
      <div>
        <h1>{chatRoom}</h1>
        <form onSubmit={onSubmit} action="">
          <input value={value} onChange={onChange} type="text" name="chat" id="chat" />
          <button type="submit">Send</button>
        </form>
        <div className="messages">
          {msg ? msg.map((x) => {
            return (
              <div key={x.id} className="chat__listitem">
                <p id={x.id}>{x.username}: {x.msg}</p>
              </div>
            )
          }) : <p>Loading...</p>}
        </div>

      </div>
      <Sidebar socket={socket} changeRoom={roomSwitch} />

    </section>

  )
}