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
  console.log(`user connected`);

  socket.on('message', (message) => {
    console.log(`[Client]: ${message}`);
    tech.emit('message', message);  // this will redistribute message to all clients, who in turn will display it on their ui
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    tech.emit('message', 'user disconnected');
  });
});
