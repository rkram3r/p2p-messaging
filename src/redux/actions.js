
import io from 'socket.io-client';
import Peer from 'simple-peer';

const onConnect = (connection, socket, dispatch) => {
  const { type, peer, ...rest } = connection;

  if (type !== 'answer') {
    socket.close();
  }
  dispatch({ type: 'NEW_PEER', peer, ...rest });
};

const onSocketConnect = (value, left, right, socket, dispatch) => {
  const { data, data: { type }, ...key } = value;
  const peer = data.type === 'answer' ? left : right;
  peer.on('connect', () => onConnect({ ...key, peer, type }, socket, dispatch));
  peer.signal(data);

  peer.on('data', message => dispatch(JSON.parse(message)));
};

const createId = () => new Array(32)
  .fill()
  .map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(62 * Math.random()))).join('');


export const createConnection = (name, address) => async (dispatch) => {
  const socket = io(address, { transports: ['websocket'], secure: true });
  const id = createId();
  dispatch({ type: 'PUBLIC_KEY', id, name });
  const left = new Peer({ initiator: true, trickle: false });
  const right = new Peer({ trickle: false });

  socket.on('p2p-connect', data => onSocketConnect(data, left, right, socket, dispatch));

  left.on('signal', data => socket.emit('p2p-connect', { data, name, id }));
  right.on('signal', data => socket.emit('p2p-connect', { data, name, id }));
};

export const onMessageChange = message => (dispatch) => {
  dispatch({ type: 'MESSAGE_CHANGE', message });
};

export const broadcast = (contactlist, message) => (dispatch) => {
  contactlist.forEach(({ peer }) => peer && peer.send(JSON.stringify({ type: 'MESSAGE', message })));
  dispatch({ type: 'SEND_MESSAGE', message });
};

export const broadcastContactlist = contactlist => () => {
  const contactlistWithoutPeers = Array
    .from(contactlist)
    .map(([key, { peer, ...rest }]) => [key, { ...rest }]);

  Array.from(contactlist).forEach(([key, { peer }]) => {
    const filteredList = contactlistWithoutPeers.filter(([id]) => id !== key);
    const message = JSON.stringify({ type: 'CONTACTLIST', contactlist: filteredList });
    if (peer) {
      peer.send(message);
    }
  });
};

export const connectionChange = connection => (dispatch) => {
  dispatch({ type: 'CONNECTION_CHANGE', connection });
};
