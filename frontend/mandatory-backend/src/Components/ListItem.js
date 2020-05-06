import React from "react";
import { truncate } from "../Utils"

export default function ListItem({ room, changeRoom, deleteRoom }) {


  function contClick(e) {
    e.stopPropagation();
    console.log("from listItem", room)
    changeRoom(room.name);
  }

  function btnClick(e) {
    e.stopPropagation();
    deleteRoom(room._id);
    console.log(room._id);
  }
  return (
    <div onClick={contClick} className="sidebar__item">
      <p className="sidebar__p">{truncate(room.name)}</p>
      {room.name === "general" ? null : <button className="sidebar__btn" onClick={btnClick}>X</button>}
    </div>
  )
}