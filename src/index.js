const P2P = require('socket.io-p2p');
const io = require('socket.io-client');

const socket = io('localhost:3030');
const options = { numClients: 10 };
const p2p = new P2P(socket, options);
console.log(p2p);
p2p.on('peer-msg', (data) => {
  console.log(data);
});
const box = document.getElementById('msg-box');
const form = document.getElementById('msg-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  p2p.emit('peer-msg', { text: box.value });
});
