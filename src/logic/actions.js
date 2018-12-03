
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
      dispatch({ type: 'PEER_READY', peer, ...key });
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
  const { lastPeer, from } = connection;

  const reciever = Array.from(contactlist)
    .filter(([key, { state }]) => state === 'PEER_READY' && lastPeer === key)
    .map(([, { peer }]) => peer);
  const sendPeerConnection = (data, peer) => peer.send(JSON.stringify({
    type: 'PING', from: id, to: from, lastPeer: id, data,
  }));
  newPeer.on('signal', (data) => {
    reciever.forEach(peer => sendPeerConnection(data, peer));
    dispatch({ type: 'CONNECTING_PEER', peer: newPeer, key: from });
  });
  newPeer.on('data', msg => dispatch({ ...JSON.parse(msg), id }));
  newPeer.on('connect', () => dispatch({ type: 'SET_PEER_READY', peer: newPeer, key: from }));
  newPeer.signal(connection.data);
};

export const ping = (contactlist, message, id) => (dispatch) => {
  const newPeer = new Peer({ initiator: true, trickle: false });
  const { lastPeer, ...rest } = message;
  const reciever = Array.from(contactlist)
    .filter(([key, { state, buddy }]) => state === 'PEER_READY' && lastPeer !== key && buddy)
    .map(([, { peer }]) => peer);

  const sendPeerConnection = (data, peer) => peer.send(JSON.stringify({
    type: 'PING', ...rest, lastPeer: id, data,
  }));
  newPeer.on('signal', (data) => {
    reciever.forEach(peer => sendPeerConnection(data, peer));
    dispatch({ type: 'CONNECTING_PEER', key: rest.to, peer: newPeer });
  });
  newPeer.on('connect', () => console.log('connect'));
};

export const onMessageChange = message => dispatch => dispatch({ type: 'MESSAGE_CHANGE', message });
export const connectionChange = connection => dispatch => dispatch({ type: 'CONNECTION_CHANGE', connection });

export const send = ({ contactlist, sendTo }, message) => (dispatch) => {
  const reciever = sendTo.length !== 0
    ? JSON.parse(sendTo).map(x => contactlist.get(x)) : contactlist;
  reciever.forEach((contact) => {
    if (contact) {
      const { peer, state } = contact;
      state === 'PEER_READY' && peer.send(JSON.stringify({ type: 'MESSAGE', message }));
    }
  });
  dispatch({ type: 'SEND_MESSAGE', message });
};
