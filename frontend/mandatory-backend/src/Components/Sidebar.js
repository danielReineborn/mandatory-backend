import React, { useEffect, useState } from "react";
import axios from "axios";
import ListItem from "./ListItem";

export default function Sidebar({ socket, changeRoom }) {
  const [rooms, updateRooms] = useState([]);
  const [value, updateValue] = useState("");

  useEffect(() => {
    axios.get("/rooms")
      .then((res) => {
        updateRooms(res.data);
      })
  }, [])

  useEffect(() => {
    socket.on("roomUpdate", rooms => {
      updateRooms(rooms);
    })
    return () => {
      socket.off("roomsUpdate");
    }
  }, [])

  function onSubmit(e) {
    e.preventDefault();
    if (value.length > 0) {
      socket.emit("room_add", value, (bool) => {
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


    }
    updateValue("");
  }

  function onChange(e) {
    let value = e.target.value;
    updateValue(value);
  }

  function deleteRoom(room) {
    socket.emit("room_delete", room, (bool) => {
      if (bool) {
        let newRooms = rooms.filter(x => x !== room);
        updateRooms(newRooms);
      }
    })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__list">
        {rooms.map((x, i) => {
          return <ListItem
            room={x}
            changeRoom={changeRoom}
            deleteRoom={deleteRoom}
            key={i}
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