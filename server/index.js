const server = require('http').createServer();
const p2pserver = require('socket.io-p2p-server').Server;
const io = require('socket.io')(server);

const port = process.env.PORT || 3030;

server.listen(port);
io.use(p2pserver);

io.on('connection', (socket) => {
  socket.on('peer-msg', (data) => {
    console.log('Message from peer: %s', data);
    socket.broadcast.emit('peer-msg', data);
  });

  socket.on('go-private', (data) => {
    socket.broadcast.emit('go-private', data);
  });
});
console.log('server started on port: ', port);
