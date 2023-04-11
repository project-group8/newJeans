const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  const userId = socket.id; // generate a unique ID for each user

  console.log('a user connected: ' + userId);

  socket.on('disconnect', () => {
    console.log('user disconnected: ' + userId);
  });


  socket.on('chat message', (msg) => {
    console.log('message from ' + userId + ': ' + msg);
    io.emit('chat message', { userId, msg }); // include user ID in the message object
  });

});

http.listen(4000, () => {
  console.log('listening on *:4000');
});