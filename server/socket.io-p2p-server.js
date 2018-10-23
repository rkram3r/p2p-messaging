const clients = {};

function p2pSocket(socket, next, room) {
  clients[socket.id] = socket;
  const connectedClients = typeof room === 'object' ? socket.adapter.rooms[room.name] : clients;
  socket.emit('numClients', Object.keys(connectedClients).length - 1);

  socket.on('disconnect', () => {
    delete clients[socket.id];
    Object.keys(connectedClients).forEach((clientId) => {
      const client = clients[clientId];
      client.emit('peer-disconnect', { peerId: socket.id });
    });
  });

  socket.on('offers', (data) => {
    // send offers to everyone in a given room
    Object.keys(connectedClients).forEach((clientId, i) => {
      const client = clients[clientId];
      if (client !== socket && data.offers[i]) {
        const offerObj = data.offers[i];
        const emittedOffer = { fromPeerId: socket.id, offerId: offerObj.offerId, offer: offerObj.offer };
        client.emit('offer', emittedOffer);
      }
    });
  });

  socket.on('peer-signal', (data) => {
    const client = clients[data.toPeerId];
    if (client) {
      client.emit('peer-signal', data);
    }
  });
  if (typeof next === 'function') {
    next();
  }
}

module.exports.Server = p2pSocket;
