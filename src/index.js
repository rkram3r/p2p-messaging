import Peer from 'peerjs';

console.log(process.env.sender);
const peer = new Peer(process.env.sender, { key: 'p2p-messaging', debug: 3 });

peer.disconnect();
const conn = peer.connect(process.env.reciever);

conn.on('open', () => {
  conn.send('hi!');
});
peer.on('connection', (connection) => {
  console.log(connection);
  connection.on('data', (data) => {
    // Will print 'hi!'
    console.log(data);
  });
});
peer.on('call', (mediaConnection) => { console.log(mediaConnection); });
console.log(peer);
