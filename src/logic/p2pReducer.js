
export default (oldState = {
  contactlist: new Map(),
  message: '',
  recievedMessages: [],
  connectingData: {},
}, action) => {
  console.log(action);
  const { type, ...rest } = action;
  if (type === 'NEW_PEER') {
    const { id, ...peer } = rest;
    const contactlist = new Map([...oldState.contactlist]);
    contactlist.set(id, { ...peer, buddy: true });
    return { ...oldState, contactlist };
  }
  if (type === 'UPDATE_PEER') {
    const { to, from, ...peer } = rest;
    const key = peer.peer.initiator ? to : from;
    const contactlist = new Map([...oldState.contactlist]);
    const oldPeer = contactlist.get(key);
    contactlist.set(key, { ...oldPeer, ...peer, buddy: false });
    return { ...oldState, contactlist, connectingData: {} };
  }

  if (type === 'UPDATE_PEER_STATE') {
    const { id, state, connection } = rest;
    const contactlist = new Map([...oldState.contactlist]);
    const oldPeer = contactlist.get(id);
    contactlist.set(id, { ...oldPeer, state, connection });
    return { ...oldState, contactlist };
  }

  if (type === 'MESSAGE') {
    const { name, message } = rest;
    const recievedMessages = [...oldState.recievedMessages,
      { name, message, recieved: new Date() }];
    return { ...oldState, recievedMessages };
  }

  if (type === 'PUBLIC_KEY') {
    console.log(rest);
    return { ...oldState, ...rest };
  }

  if (type === 'PING') {
    const { name, id, ...connectingData } = rest;
    return { ...oldState, connectingData };
  }

  if (type === 'MESSAGE_CHANGE') {
    return { ...oldState, ...rest };
  }

  if (type === 'CONTACTLIST') {
    const { contactlist } = rest;
    return { ...oldState, contactlist: new Map([...contactlist, ...oldState.contactlist]) };
  }

  if (type === 'SEND_MESSAGE') {
    const { message } = action;
    const recievedMessages = [...oldState.recievedMessages,
      { myMessage: true, message, recieved: new Date() }];
    return { ...oldState, recievedMessages, message: '' };
  }

  return oldState;
};
