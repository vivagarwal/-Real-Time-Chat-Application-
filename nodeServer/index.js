const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"]
  }
});
// const io = require('socket.io')(80);
const users = {};

io.on('connection', socket => {
    // When a new user joins
    socket.on('new-user-joined', name => {
        console.log("New User", name);
        users[socket.id] = name;
        // Notify all other users
        socket.broadcast.emit('user-joined', name);
    });

    // When a user sends a message
    socket.on('send', message => {
        // Broadcast the message to all other users
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        // Notify all other users
        socket.broadcast.emit('left', users[socket.id]);
        // Remove the user from the list
        delete users[socket.id];
    });
});

app.get('/socket.io', (req, res) => {
    res.send('Socket.io endpoint');
  });
  
  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });