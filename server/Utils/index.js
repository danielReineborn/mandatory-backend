const uuidv4 = require("uuid").v4
const {
  getClient,
  getDB,
  createObjectId
} = require("../db");





function save(data, file) {
  const fs = require("fs");

  fs.writeFile(`./${file}`, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log(`written to ${file}`);
  })
}

function setId(username) {
  return {
    username: username,
    id: uuidv4(),
  }
}

function joinRoom(username) {
  return {
    username: "SERVER",
    msg: `${username} has joined the room.`,
    _id: uuidv4(),
  }
}

function leaveRoom(username) {
  return {
    username: "SERVER",
    msg: `${username} has left the room.`,
    _id: uuidv4(),
  }
}

function validateRoom(roomsArr, newRoom) {
  for (let room of roomsArr) {
    if (room.name.toLowerCase() === newRoom.toLowerCase()) {
      return true;
    }
  }
  return false;
}

module.exports.save = save;
module.exports.join = joinRoom;
module.exports.leave = leaveRoom;
module.exports.valRoom = validateRoom;
module.exports.setId = setId;