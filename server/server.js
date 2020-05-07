const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require("fs");
const fn = require("./Utils");
const port = 8080;
const {
  getClient,
  getDB,
  createObjectId
} = require("./db");

//clientsent msgs.

//Chatinfo
let users = {};

//Middlewares
app.use(express.json());

//GET
app.get('/messages/:room', (req, res) => {
  let room = req.params.room;
  const db = getDB();
  db.collection(room)
    .find({})
    .toArray()
    .then(resp => {
      res.json(resp);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    })
});

app.get("/rooms", (req, res) => {
  const db = getDB();
  db.collection("rooms")
    .find({})
    .toArray()
    .then(resp => {
      res.json(resp);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    })
})

//Check what rooms a user in, emit all corresponding msgs. 
io.on('connection', (socket) => {
  socket.on("adduser", (username) => {
    socket.username = username;

    socket.room = "general";
    socket.join(socket.room);

    let msg = fn.setId(username);

    socket.emit("token", msg)

    users[username] = {
      user: username,
      id: msg.id,
    };
    console.log(users);

  })

  socket.on("new_message", (msg, cb) => {
    const db = getDB();
    newMsg = {
      ...msg,
      connection: socket.id,
      timestamp: Date.now(),
    }


    db.collection(newMsg.room)
      .insertOne(newMsg)
      .then(res => {
        cb(res.insertedId);

        socket.broadcast.to(newMsg.room).emit("message", newMsg); // socket.broadcast sends to all but self. (io.emit === sends all)
      })
      .catch(e => {
        console.error(e);

      })
  })

  socket.on("room_switch", (newRoom, cb) => {
    let leaveMsg = fn.leave(socket.username);
    socket.broadcast.to(socket.room).emit("message", leaveMsg)
    socket.leave(socket.room);

    socket.join(newRoom);

    let joinMsg = fn.join(socket.username);
    socket.broadcast.to(newRoom).emit("message", joinMsg)

    socket.room = newRoom;
    cb(socket.room);
  })

  socket.on("room_add", (roomName, cb) => {
    const db = getDB();
    db.collection("rooms")
      .find({})
      .toArray()
      .then(resp => {
        console.log(resp);
        let val = fn.valRoom(resp, roomName.name)
        if (val) {
          socket.off("room_add");
          return;
        } else {
          db.collection("rooms")
            .insertOne(roomName)
            .then(resp => {
              db.createCollection(roomName.name, (err, res) => {
                if (err) throw err;
                socket.broadcast.emit("roomUpdate", resp.result);
              })
              cb(true);
            })
            .catch(e => {
              console.error(e);
            })
        }

      })
      .catch(e => {
        console.error(e);
      })

  })

  socket.on("room_delete", (roomId, cb) => {
    const db = getDB();

    db.collection("rooms")
      .findOne({
        _id: createObjectId(roomId)
      })
      .then(result => {
        let collection = result.name;

        db.collection("rooms").deleteOne({
            _id: createObjectId(roomId)
          })
          .then(res => {
            console.log(res.result)
          })
          .catch(e => {
            console.error(e);
          });

        db.collection(collection).drop((err, res) => {
          if (err) throw err;

          socket.broadcast.emit("roomUpdate", res);
          console.log(res)
          cb(res);
        })
      })
      .catch(e => {
        console.error(e);

      });
  })

});

http.listen(port, () => {
  console.log("Server started, listening on: " + port);
});