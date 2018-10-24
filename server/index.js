const server = require('http').createServer();
const io = require('socket.io')(server);
const p2pSocket = require('./socket.io-p2p-server').Server;

const port = process.env.PORT || 3030;

server.listen(port, () => console.log('server started on port: ', port));
io.use(p2pSocket);


io.on('connection', (socket) => {
  socket.on('peer-msg', (data) => {
    console.log('Message from peer: %s', data);
    socket.broadcast.emit('peer-msg', data);
  });

  socket.on('go-private', (data) => {
    socket.broadcast.emit('go-private', data);
  });
});
