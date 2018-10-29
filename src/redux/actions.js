
import io from 'socket.io-client';
import Peer from 'simple-peer';

export const createConnection = (myName, address) => (dispatch) => {
  const socket = io(address, { transports: ['websocket'], secure: true });

  const left = new Peer({ initiator: true, trickle: false });
  const right = new Peer({ trickle: false });

  socket.on('p2p-connect', ({ name, data }) => {
    const peer = data.type === 'answer' ? left : right;
    peer.signal(data);
    peer.on('connect', () => {
      if (data.type !== 'answer') {
        socket.close();
      }
      dispatch({ type: 'NEW_PEER', name, peer });
    });
    peer.on('data', message => dispatch({ type: 'RECIEVE_MESSAGE', message, name }));
  });

  left.on('signal', data => socket.emit('p2p-connect', { data, name: myName }));
  right.on('signal', data => socket.emit('p2p-connect', { data, name: myName }));

  dispatch({ socket, type: 'CREATE_SOCKET' });
  dispatch({ left, right, type: 'CREATE_PEERS' });
};

export const onMessageChange = message => (dispatch) => {
  dispatch({ type: 'MESSAGE_CHANGE', message });
};

export const sendMessage = (peers, message) => (dispatch) => {
  peers.forEach(({ peer }) => peer.send(message));
  dispatch({ type: 'SEND_MESSAGE', message });
};

export const connectionChange = connection => (dispatch) => {
  dispatch({ type: 'CONNECTION_CHANGE', connection });
};
