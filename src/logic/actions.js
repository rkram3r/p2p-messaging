
import io from 'socket.io-client';
import Peer from 'simple-peer';

const createId = () => Math.floor(1000000000 * Math.random());

export const createConnection = (name, address) => async (dispatch) => {
  const socket = io(address, { transports: ['websocket'], secure: true });
  const id = createId();
  dispatch({ type: 'PUBLIC_KEY', id, name });
  const leftBuddy = new Peer({ initiator: true, trickle: false });
  const rightBuddy = new Peer({ trickle: false });

  socket.on('p2p-connect', (message) => {
    const { data, data: { type }, ...key } = message;
    const peer = type === 'answer' ? leftBuddy : rightBuddy;
    peer.on('connect', () => {
      dispatch({
        type: 'NEW_PEER', peer, ...key, state: 'READY',
      });
      type !== 'answer' && socket.close();
    });
    peer.signal(data);

    peer.on('data', d => dispatch({ ...JSON.parse(d), ...key }));
  });

  leftBuddy.on('signal', data => socket.emit('p2p-connect', { data, name, id }));
  rightBuddy.on('signal', data => socket.emit('p2p-connect', { data, name, id }));
};

export const createPeerConnection = (contactlist, idFrom, id) => (dispatch) => {
  const { connection } = contactlist.get(idFrom);
  const newPeer = new Peer({ trickle: false });
  const {
    lastPeer, from, ...rest
  } = connection;

  const reciever = Array.from(contactlist)
    .filter(([key, { state }]) => state === 'READY' && lastPeer === key)
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
  newPeer.signal(connection.data);
};

export const finalizeConnection = (contactlist, message) => (dispatch) => {
  const { from, data } = message;
  const { peer, name } = contactlist.get(from);
  peer.on('data', msg => dispatch({ ...JSON.parse(msg), id: from, name }));
  peer.on('connect', () => {
    dispatch({
      type: 'UPDATE_PEER', peer, to: from, state: 'READY',
    });
  });
  peer.signal(data);
};

export const forwardPing = (contactlist, message, id) => () => {
  const { lastPeer, ...rest } = message;
  const reciever = Array.from(contactlist)
    .filter(([key, { state, buddy }]) => state === 'READY' && lastPeer !== key && buddy)
    .map(([, { peer }]) => peer);
  const sendPeerConnection = peer => peer.send(JSON.stringify({
    type: 'PING', ...rest, lastPeer: id,
  }));
  reciever.forEach(sendPeerConnection);
};

export const updatePeer = (id, state, connection) => (dispatch) => {
  dispatch({
    type: 'UPDATE_PEER_STATE', id, state, connection,
  });
};

export const ping = (contactlist, message, id) => (dispatch) => {
  const newPeer = new Peer({ initiator: true, trickle: false });
  const { lastPeer, ...rest } = message;
  const reciever = Array.from(contactlist)
    .filter(([key, { state, buddy }]) => state === 'READY' && lastPeer !== key && buddy)
    .map(([, { peer }]) => peer);

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
  const reciever = sendTo.length !== 0
    ? JSON.parse(sendTo).map(x => contactlist.get(x)) : contactlist;
  reciever.forEach((contact) => {
    if (contact) {
      const { peer, state } = contact;
      if (state === 'READY') {
        peer.send(JSON.stringify({ type: 'MESSAGE', message }));
      }
    }
  });
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