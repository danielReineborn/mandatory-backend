import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { Redirect } from "react-router-dom";
import moment from "moment";
import localization from 'moment/locale/de'
import { capLetter } from "../Utils";
import Sidebar from "./Sidebar";
import { token$ } from '../Observables/store';

export default function Chat({ socket }) {
  const [msg, updateMsg] = useState([]);
  const [value, updateValue] = useState("");
  const [chatRoom, updateChatRoom] = useState("general");
  const [token, updateToken] = useState(token$.value);


  const myRef = useRef();
  const scroll = useRef();
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
      let msgCopy = [...msg];
      msgCopy.push(data);
      updateMsg(msgCopy);
      myRef.current.scrollTo(0, myRef.current.scrollHeight)
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

    if (!value) return;

    let newMessage = {
      username: socket.username,
      msg: value,
      room: chatRoom,
      timestamp: Date.now(),
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
      <div className="chat__title-cont">

        <h1 className="chat__title">{capLetter(chatRoom)}</h1>
      </div>
      <div className="chatview__chat">
        <div className="chatview__messages">
          {msg ? msg.map((x) => {
            return (
              <div key={x._id} className="chat__listitem">

                <p className="listitem__time">{x.timestamp ? moment(x.timestamp).locale("se", localization).format("LT") : null}</p>
                <p className="listitem__msg" id={x._id}><b>{x.username}</b>: {x.msg}</p>
                <div ref={myRef}></div>
              </div>
            )
          }) : <p>Loading...</p>}
        </div>
        <form className="form" onSubmit={onSubmit} action="">
          <input autoComplete="off" placeholder={`Write something to @${chatRoom}`} className="form__input" value={value} onChange={onChange} type="text" name="chat" id="chat" />
        </form>

      </div>
      <Sidebar socket={socket} changeRoom={roomSwitch} />

    </section >

  )
}