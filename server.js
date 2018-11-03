const server = require('http').createServer();
const io = require('socket.io')(server);

const port = process.env.PORT || 3030;

server.listen(port, () => console.log('server started on port: ', port));

const peers = new Map();
io.on('connection', (socket) => {
  socket.on('register', (data) => {
    peers.set(socket.id, data);
    console.log('register', socket.id);

    Array.from(peers)
      .filter(([key]) => key !== socket.id)
      .forEach(([id, value], index) => {
        io.to(id).emit('register', ({ ...value[index], from: socket.id }));
      });
  });
  socket.on('answer', (data) => {
    console.log('answer', socket.id, data.to);
    io.to(data.to).emit('answer', data);
  });
});
