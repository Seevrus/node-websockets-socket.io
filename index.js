const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// tech namespace
const tech = io.of('/tech');

tech.on('connection', (socket) => {
  socket.on('join', ({ room }) => {
    socket.join(room);
    tech.in(room).emit('message', `[new user has joined ${room} room]`);
  });

  socket.on('message', ({ room, msg }) => {
    tech.in(room).emit('message', msg);  // this will redistribute message to all clients in the room, who in turn will display it on their ui
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    tech.emit('message', 'user disconnected');
  });
});
