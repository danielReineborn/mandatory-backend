const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require("fs");
const fn = require("./Utils");
const uuidv4 = require("uuid").v4
const port = 8080;
const error = require("./Utils/eventmessages");
const event = require("./Utils/eventmessages");

//clientsent msgs.
// msg = {username: "string", msg: "string", id: "socket.id", connection: socket.id} - ev byta ut id till uuid.
let messages = JSON.parse(fs.readFileSync("db.json")) || [];

//Chatinfo
let users = {};
let rooms = JSON.parse(fs.readFileSync("rooms.json")) || [];

//Middlewares
app.use(express.json());

//GET
app.get('/messages', (req, res) => {
  res.json(messages);
});

//GET /rooms
app.get("/rooms", (req, res) => {
  res.json(rooms);
})

//Check what rooms a user in, emit all corresponding msgs. 
io.on('connection', (socket) => {
  let id = socket.id;

  socket.on("adduser", (username) => {
    socket.username = username;
    users[username] = username;

    socket.room = "general"; //kommer att skickas till servern vilket rum man är i.
    socket.join(socket.room);

    /*  let serverMsg = fn.join(socket.username);
     socket.broadcast.to(socket.room).emit("message", serverMsg) */

  })

  console.log('a user connected: ' + socket.rooms[id]);

  socket.on("new_message", msg => {
    console.log(msg.room + ": " + typeof msg.room);
    msg = {
      ...msg,
      id: uuidv4(),
      connection: socket.id,
      timestamp: Date.now(),
    }
    socket.broadcast.to(msg.room).emit("message", msg); // socket.broadcast sends to all but self. (io.emit === sends all) 
    messages[msg.room].push(msg);
    fn.save(messages, "db.json");
  })

  socket.on("room_switch", (newRoom, cb) => {
    let leaveMsg = fn.leave(socket.username);
    socket.broadcast.to(socket.room).emit("message", leaveMsg)
    socket.leave(socket.room);

    socket.join(newRoom);

    let joinMsg = fn.join(socket.username);
    socket.broadcast.to(newRoom).emit("message", joinMsg)

    socket.room = newRoom;
    cb(Object.keys(socket.rooms));
  })

  socket.on("room_add", (roomName, cb) => {
    //Se till att rum namn är unikt.
    let val = fn.valRoom(rooms, roomName)
    if (val) {
      //emit error?
      socket.off("room_add");
    }
    //socket.leave(old) > socket.join(new);
    rooms.push(roomName);
    fn.save(rooms, "rooms.json");
    messages[roomName] = [];
    fn.save(messages, "db.json");
    socket.leave(socket.room);
    socket.join(roomName);

    socket.room = roomName;
    //Om inte -> error.
    //om unikt -> room.push(roomName)
    socket.broadcast.emit("roomUpdate", rooms);
    cb(true);
  })

  socket.on("room_delete", (roomName, cb) => {
    let val = fn.valRoom(rooms, roomName);
    console.log(val);
    if (val) {
      rooms = rooms.filter(x => x !== roomName);
      delete messages[roomName];

      fn.save(rooms, "rooms.json");
      fn.save(messages, "db.json");
      socket.broadcast.emit("roomUpdate", rooms);

      cb(true);
      return;
    }
    //socket error?

  })

  //Fixa socket.on("error"...)...

});

http.listen(port, () => {
  console.log("Server started, listening on: " + port);
});


/* 
Events: 
new_message - when a client sends a message.
message - when server broadcasts msg.
room_join - to join named room.
room_join_msg - to send a message when user has joined a room.
room_leave - to leave named room.
room_leave_msg - to send a message to participants that a user has left.

*/