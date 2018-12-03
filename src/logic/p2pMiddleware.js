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
  const { type, ...rest } = action;
  if (type === 'CONTACTLIST') {
    Array.from(contactlist).forEach(([key, { peer, buddy }], _, array) => {
      if (key !== rest.lastPeer && buddy && peer) {
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
  const { type, ...connectingData } = action;
  const peerFrom = contactlist.get(connectingData.from) || false;
  if (type !== 'PING') {
    return next(action);
  }
  if (peerFrom && peerFrom.state === 'CONNECTING_PEER'
   && connectingData.to && id === connectingData.to) {
    const { from, data } = connectingData;
    const { peer, name } = contactlist.get(from);
    peer.on('data', msg => store.dispatch({ ...JSON.parse(msg), id: from, name }));
    peer.on('connect', () => store.dispatch({ type: 'SET_PEER_READY', peer, key: from }));
    peer.signal(data);
  }

  return next(action);
};

export const askToConnect = store => next => (action) => {
  const { p2pReducer: { contactlist, id } } = store.getState();
  const { type, ...connectingData } = action;

  if (type !== 'PING') {
    return next(action);
  }
  const peerFrom = contactlist.get(connectingData.from) || false;

  if (peerFrom && peerFrom.state === 'NOT_CONNECTED' && id === connectingData.to) {
    store.dispatch({ type: 'ASK_TO_CONNECT', id: connectingData.from, connection: connectingData });
  }

  return next(action);
};

export const forwardPing = store => next => (action) => {
  const { p2pReducer: { contactlist, id } } = store.getState();
  const { type, ...connectingData } = action;

  if (type === 'PING') {
    const peerTo = contactlist.get(connectingData.to) || false;

    if (peerTo && peerTo.state !== 'CONNECTING_PEER' && connectingData.to && id !== connectingData.to) {
      const { lastPeer, ...rest } = connectingData;
      const reciever = Array.from(contactlist)
        .filter(([key, { state, buddy }]) => state === 'PEER_READY' && lastPeer !== key && buddy)
        .map(([, { peer }]) => peer);
      const sendPeerConnection = peer => peer.send(JSON.stringify({
        type: 'PING', ...rest, lastPeer: id,
      }));
      reciever.forEach(sendPeerConnection);
    }
  }

  return next(action);
};
