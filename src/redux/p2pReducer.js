
export default (oldState = {
  contactlist: new Map(),
  message: '',
  recievedMessages: [],
  connectingData: {},
}, action) => {
  const { type, ...rest } = action;
  if (type === 'NEW_PEER') {
    const { id, ...peer } = rest;
    const contactlist = new Map([...oldState.contactlist]);
    contactlist.set(id, { ...peer });
    return { ...oldState, contactlist };
  }
  if (type === 'UPDATE_PEER') {
    const { to, from, ...peer } = rest;
    const key = peer.peer.initiator ? to : from;
    console.log(rest);
    const contactlist = new Map([...oldState.contactlist]);
    const oldPeer = contactlist.get(key);
    contactlist.set(key, { ...oldPeer, ...peer });
    return { ...oldState, contactlist, connectingData: {} };
  }

  if (type === 'MESSAGE') {
    const { name, message } = rest;
    const recievedMessages = [...oldState.recievedMessages,
      { name, message, recieved: new Date() }];
    return { ...oldState, recievedMessages };
  }

  if (type === 'PUBLIC_KEY') {
    return { ...oldState, ...rest };
  }

  if (type === 'PING') {
    const { name, id, ...connectingData } = rest;
    console.log('PING', rest);
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
