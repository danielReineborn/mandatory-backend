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
    socket.on("roomUpdate", response => {
      if (response) {
        axios.get("/rooms")
          .then(response => {
            let update = response.data;
            console.log(update);
            updateRooms(update);

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
          <label htmlFor="add">Create new room</label>
          <input onChange={onChange} value={value} type="text" name="add" id="add" />
          <button type="submit">Add</button>
        </form>
      </div>
    </aside >
  )
}