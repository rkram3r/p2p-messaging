export default store => next => (action) => {
  const { p2pReducer: { contactlist } } = store.getState();
  const { type, ...rest } = action;
  if (type === 'PEER_READY') {
    const contactlistWithoutPeers = Array
      .from(contactlist)
      .map(([key, { peer, ...x }]) => [key, { ...x, state: 'NOT_CONNECTED' }]);

    action.peer.send(JSON.stringify({ type: 'CONTACTLIST', contactlist: contactlistWithoutPeers }));
    Array.from(contactlist).forEach(([key, { peer, buddy }]) => {
      const filteredList = new Map([...contactlistWithoutPeers.filter(([id]) => id !== key),
        [rest.id, { ...rest, state: 'NOT_CONNECTED' }]]);
      const message = JSON.stringify({ type: 'CONTACTLIST', contactlist: filteredList, state: 'NOT_CONNECTED' });
      if (buddy) {
        peer.send(message);
      }
    });
  }

  return next(action);
};
