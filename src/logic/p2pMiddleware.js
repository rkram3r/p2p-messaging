import { abi, address } from '../constants';
import stringHash from './stringHash';

export const sendContactlistToBuddy = store => next => (action) => {
  const { p2pReducer: { contactlist, id } } = store.getState();
  const { type, ...rest } = action;
  if (type === 'PEER_READY') {
    const contactlistWithoutPeers = Array
      .from(contactlist)
      .map(([key, { peer, ...x }]) => [key, { ...x, state: 'NOT_CONNECTED' }]);
    action.peer.send(JSON.stringify({ type: 'CONTACTLIST', contactlist: contactlistWithoutPeers }));
    Array.from(contactlist).forEach(([key, { peer, buddy }]) => {
      const filteredList = new Map([...contactlistWithoutPeers.filter(([x]) => x !== key),
        [rest.id, { ...rest, state: 'NOT_CONNECTED' }]]);
      const message = JSON.stringify({
        type: 'CONTACTLIST', lastPeer: id, contactlist: filteredList,
      });
      if (buddy && peer) {
        peer.send(message);
      }
    });
  }

  return next(action);
};

export const broadcastContactlist = store => next => (action) => {
  const { p2pReducer: { contactlist, id } } = store.getState();
  const { type, lastPeer } = action;
  if (type === 'CONTACTLIST') {
    Array.from(contactlist).forEach(([key, { peer, buddy }], _, array) => {
      if (key !== lastPeer && buddy && peer) {
        const filteredList = new Map([...array.filter(([x]) => x !== key)]);
        const message = JSON.stringify({
          type: 'CONTACTLIST', lastPeer: id, contactlist: filteredList,
        });
        peer.send(message);
      }
    });
  }

  return next(action);
};

export const finalizeConnection = store => next => (action) => {
  const { p2pReducer: { contactlist, id } } = store.getState();
  const {
    type, from, to, data,
  } = action;
  const peerFrom = contactlist.get(from) || false;
  if (type !== 'PING') {
    return next(action);
  }
  if (peerFrom && peerFrom.state === 'CONNECTING_PEER'
   && to && id === to) {
    const { peer, name } = contactlist.get(from);
    peer.on('data', msg => store.dispatch({ ...JSON.parse(msg), id: from, name }));
    peer.on('connect', () => store.dispatch({ type: 'SET_PEER_READY', peer, key: from }));
    peer.signal(data);
  }

  return next(action);
};

export const askToConnect = store => next => (action) => {
  const { p2pReducer: { contactlist, id } } = store.getState();
  const {
    type, from, to, ...rest
  } = action;

  if (type !== 'PING') {
    return next(action);
  }
  const peerFrom = contactlist.get(from) || false;

  if (peerFrom && peerFrom.state === 'NOT_CONNECTED' && id === to) {
    store.dispatch({ type: 'ASK_TO_CONNECT', id: from, connection: { from, to, ...rest } });
  }

  return next(action);
};
export const verify = store => next => (action) => {
  const { message, type, messageId } = action;
  if (type === 'VERIFY_MESSAGE') {
    const { ethereum, web3 } = window;
    if (!(ethereum || web3)) {
      store.dispatch({ type: 'WARNING', message: 'Non-Ethereum browser detected. You should consider trying MetaMask!' });
      return next(action);
    }

    window.web3 = new Web3(web3.currentProvider);
    const { eth: { defaultAccount } } = window.web3;

    const hash = stringHash(message);

    const contractAt = window.web3.eth.contract(abi).at(address);
    contractAt.verify(defaultAccount, hash, (error, result) => {
      if (error) {
        store.dispatch({ type: 'WARNING', message: error });
      } else {
        const { c } = result;
        if (c[0] > 0) {
          store.dispatch({ type: 'VERIFIED', result, messageId });
        } else {
          store.dispatch({ type: 'WARNING', message: 'Wrong Entry.' });
        }
      }
    });
  }
  return next(action);
};
export const forwardPing = store => next => (action) => {
  const { p2pReducer: { contactlist, id } } = store.getState();
  const {
    type, from, to, lastPeer, ...rest
  } = action;

  if (type === 'PING') {
    const peerTo = contactlist.get(to) || false;

    if (peerTo && peerTo.state !== 'CONNECTING_PEER' && to && id !== to) {
      const reciever = Array.from(contactlist)
        .filter(([key, { state, buddy }]) => state === 'PEER_READY' && lastPeer !== key && buddy)
        .map(([, { peer }]) => peer);
      const sendPeerConnection = peer => peer.send(JSON.stringify({
        type: 'PING', ...rest, from, to, lastPeer: id,
      }));
      reciever.forEach(sendPeerConnection);
    }
  }

  return next(action);
};
