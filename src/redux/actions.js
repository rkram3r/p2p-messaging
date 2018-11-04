
import io from 'socket.io-client';
import Peer from 'simple-peer';

const onConnect = (connection, socket, dispatch) => {
  const { type, peer, ...rest } = connection;

  if (type !== 'answer') {
    socket.close();
  }
  dispatch({
    type: 'NEW_PEER', peer, ...rest, state: 'READY',
  });
};

const onSocketConnect = (value, left, right, socket, dispatch) => {
  const { data, data: { type }, ...key } = value;
  const peer = data.type === 'answer' ? left : right;
  peer.on('connect', () => onConnect({ ...key, peer, type }, socket, dispatch));
  peer.signal(data);

  peer.on('data', message => dispatch({ ...JSON.parse(message), ...key }));
};

const createId = () => new Array(32)
  .fill()
  .map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(62 * Math.random()))).join('');


export const createConnection = (name, address) => async (dispatch) => {
  const socket = io(address, { transports: ['websocket'], secure: true });
  const id = createId();
  console.log(id);
  dispatch({ type: 'PUBLIC_KEY', id, name });
  const left = new Peer({ initiator: true, trickle: false });
  const right = new Peer({ trickle: false });

  socket.on('p2p-connect', data => onSocketConnect(data, left, right, socket, dispatch));

  left.on('signal', data => socket.emit('p2p-connect', { data, name, id }));
  right.on('signal', data => socket.emit('p2p-connect', { data, name, id }));
};

export const createPeerConnection = (contactlist, message, id) => (dispatch) => {
  const newPeer = new Peer({ trickle: false });
  const {
    lastPeer, from, ...rest
  } = message;
  const reciever = Array.from(contactlist)
    .filter(([key, { state }]) => state === 'READY' && lastPeer !== key)
    .map(([, { peer }]) => peer);

  const sendPeerConnection = (data, peer) => peer.send(JSON.stringify({
    type: 'PING', from: id, to: from, lastPeer: id, data,
  }));
  newPeer.on('signal', (data) => {
    reciever.forEach(peer => sendPeerConnection(data, peer));
    dispatch({
      type: 'UPDATE_PEER', peer: newPeer, from, ...rest, state: 'CONNECTING',
    });
  });
  newPeer.on('data', msg => dispatch({ ...JSON.parse(msg), id }));
  newPeer.on('connect', () => {
    dispatch({
      type: 'UPDATE_PEER', peer: newPeer, from, state: 'READY',
    });
  });
  newPeer.signal(message.data);
};

export const finalizeConnection = (contactlist, message) => (dispatch) => {
  const { from, data } = message;
  const { peer, name } = contactlist.get(from);
  peer.on('data', msg => dispatch({ ...JSON.parse(msg), id: from, name }));
  peer.on('connect', () => {
    console.log('connect');
    dispatch({
      type: 'UPDATE_PEER', peer, to: from, state: 'READY',
    });
  });
  peer.signal(data);
};

export const forwardPing = (contactlist, message, id) => () => {
  const { lastPeer, ...rest } = message;
  const reciever = Array.from(contactlist)
    .filter(([key, { state }]) => state === 'READY' && lastPeer !== key)
    .map(([, { peer }]) => peer);
  console.log('forwardping', message);
  const sendPeerConnection = peer => peer.send(JSON.stringify({
    type: 'PING', ...rest, lastPeer: id,
  }));
  reciever.forEach(sendPeerConnection);
};


export const ping = (contactlist, message, id) => (dispatch) => {
  const newPeer = new Peer({ initiator: true, trickle: false });
  const { lastPeer, ...rest } = message;
  const reciever = Array.from(contactlist)
    .filter(([key, { state }]) => state === 'READY' && lastPeer !== key)
    .map(([, { peer }]) => peer);
  console.log('PING', rest.from, rest.to);

  const sendPeerConnection = (data, peer) => peer.send(JSON.stringify({
    type: 'PING', ...rest, lastPeer: id, data,
  }));
  newPeer.on('signal', (data) => {
    reciever.forEach(peer => sendPeerConnection(data, peer));
    dispatch({
      type: 'UPDATE_PEER', ...rest, peer: newPeer, state: 'CONNECTING',
    });
  });
  newPeer.on('connect', () => console.log('connect'));
};

export const onMessageChange = message => (dispatch) => {
  dispatch({ type: 'MESSAGE_CHANGE', message });
};

export const send = ({ contactlist, sendTo }, message) => (dispatch) => {
  const reciever = contactlist.get(sendTo) ? [contactlist.get(sendTo)] : contactlist;

  reciever.forEach(({ peer, state }) => state === 'READY' && peer.send(JSON.stringify({ type: 'MESSAGE', message })));
  dispatch({ type: 'SEND_MESSAGE', message });
};

export const broadcastContactlist = contactlist => () => {
  const contactlistWithoutPeers = Array
    .from(contactlist)
    .map(([key, { peer, ...rest }]) => [key, { ...rest, state: 'NOT_CONNECTED' }]);

  Array.from(contactlist).forEach(([key, { peer, state }]) => {
    const filteredList = contactlistWithoutPeers.filter(([id]) => id !== key);
    const message = JSON.stringify({ type: 'CONTACTLIST', contactlist: filteredList });
    if (state === 'READY') {
      peer.send(message);
    }
  });
};

export const connectionChange = connection => (dispatch) => {
  dispatch({ type: 'CONNECTION_CHANGE', connection });
};
