import React from "react";

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
      <p>{room.name}</p>
      <button onClick={btnClick}>X</button>
    </div>
  )
}