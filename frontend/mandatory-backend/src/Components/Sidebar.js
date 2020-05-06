import React, { useEffect, useState } from "react";
import axios from "axios";
import ListItem from "./ListItem";
import Header from "./Header";

export default function Sidebar({ socket, changeRoom }) {
  const [rooms, updateRooms] = useState([]);
  const [value, updateValue] = useState("");

  useEffect(() => {
    axios.get("/rooms")
      .then((res) => {
        console.log(res);
        updateRooms(res.data);
      })
  }, [])

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    socket.on("roomUpdate", response => {
      if (response) {
        axios.get("/rooms", {
          cancelToken: source.token,
        })
          .then(response => {
            let update = response.data;
            console.log(update);
            updateRooms(update);
          })
          .catch(e => {
            if (axios.isCancel(e)) {
              console.log("Request canceled: " + e.message)
            } else {
              console.error(e);
            }
          })
      }
    })
    return () => {

      socket.off("roomsUpdate");
    }
  }, [])

  function onSubmit(e) {
    e.preventDefault();
    if (value.length <= 0) return;
    let room = {
      name: value,
    }
    socket.emit("room_add", room, (bool) => {
      updateValue("");

      if (bool) {
        axios.get("/rooms")
          .then((res) => {
            updateRooms(res.data);

          })
          .catch((e) => {
            console.error(e);
          })

      }
    })
    /* axios.post(`/rooms`, room)
      .then((response) => {
        console.log(response);
      }) */



    updateValue("");
  }

  function onChange(e) {
    let value = e.target.value;
    updateValue(value);
  }

  function deleteRoom(room) {
    socket.emit("room_delete", room, (bool) => {
      if (bool) {
        let newRooms = rooms.filter(x => x._id !== room);
        updateRooms(newRooms);
      }
    })
  }

  return (
    <aside className="sidebar">
      <Header socket={socket} />
      <div className="sidebar__list">
        {rooms.map((x, i) => {
          return <ListItem
            room={x}
            changeRoom={changeRoom}
            deleteRoom={deleteRoom}
            key={x._id}
          />
        })}
      </div>
      <div className="sidebar__container">
        <form onSubmit={onSubmit} action="">
          <input placeholder="Add room" className="form__input input--room" onChange={onChange} value={value} type="text" name="add" id="add" />
          <button className="form__btn" type="submit">Add</button>
        </form>
      </div>
    </aside >
  )
}