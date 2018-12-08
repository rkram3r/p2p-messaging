
import io from 'socket.io-client';
import Peer from 'simple-peer';
import stringHash from './stringHash';
import { abi, address } from '../constants';

const createId = () => Math.floor(1000000000 * Math.random());

export const store = (message, reciever) => async (dispatch) => {
  const { ethereum, web3 } = window;
  console.log('message', ethereum, web3);
  if (!(ethereum || web3)) {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    return;
  }

  if (ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
    } catch (error) {
      console.log('User denied account access...');
    }
  } else {
    window.web3 = new Web3(web3.currentProvider);
  }

  const { eth } = window.web3;
  console.log(window.web3.eth);
  const hash = stringHash(message);

  const contractAt = eth.contract(abi).at(address);
  contractAt.store(hash, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log(result);
      reciever.forEach((contact) => {
        if (contact) {
          const { peer, state } = contact;
          state === 'PEER_READY' && peer.send(JSON.stringify({ type: 'VERIFY_MESSAGE', message, result }));
        }
      });
    }
  });
};

export const verify = message => async () => {
  const { ethereum, web3 } = window;

  if (!(ethereum || web3)) {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    return;
  }

  if (ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      await ethereum.enable();
    } catch (error) {
      console.log('User denied account access...');
    }
  } else {
    window.web3 = new Web3(web3.currentProvider);
  }
  const { eth: { defaultAccount, contract } } = web3;

  const hash = stringHash(message);

  const contractAt = contract(abi).at(address);
  contractAt.verify(defaultAccount, hash, (e, r) => console.log(e, r));
};

export const createConnection = (name, serverAddress) => async (dispatch) => {
  const socket = io(serverAddress, { transports: ['websocket'], secure: true });
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
export const verifyChange = verifyMessage => dispatch => dispatch({ type: 'VERIFY_CHANGE', verifyMessage });

export const send = ({ contactlist, sendTo }, message, from, verifyMessage) => (dispatch) => {
  const selectedReciever = sendTo.length !== 0
    ? JSON.parse(sendTo).filter(x => contactlist.get(x)).map(x => contactlist.get(x)) : contactlist;
  const reciever = selectedReciever.length === 0 ? contactlist : selectedReciever;
  reciever.forEach((contact) => {
    if (contact) {
      const { peer, state } = contact;
      state === 'PEER_READY' && peer.send(JSON.stringify({ type: 'MESSAGE', message, from }));
    }
  });
  verifyMessage && dispatch(store(message, reciever));

  dispatch({ type: 'SEND_MESSAGE', message });
};
