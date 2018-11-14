const server = require('http').createServer();
const io = require('socket.io')(server);

const port = process.env.PORT || 3030;

server.listen(port, () => console.log('server started on port: ', port));

io.on('connection', socket => socket.on('p2p-connect',
  data => socket.broadcast.emit('p2p-connect', data)));
