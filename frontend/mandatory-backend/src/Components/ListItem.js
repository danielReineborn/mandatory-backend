import React from "react";

export default function ListItem({ room, changeRoom, deleteRoom }) {


  function contClick(e) {
    e.stopPropagation();
    console.log("from listItem", room)
    changeRoom(room);
  }

  function btnClick(e) {
    e.stopPropagation();
    deleteRoom(room);
  }
  return (
    <div onClick={contClick} className="sidebar__item">
      <p>{room}</p>
      <button onClick={btnClick}>X</button>
    </div>
  )
}