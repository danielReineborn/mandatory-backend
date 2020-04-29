import React from "react";

export function renderMsg(msg) {
  return <p className="listitem--msg">{msg.username}: {msg.msg}</p>
}

export function capLetter(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase();
}