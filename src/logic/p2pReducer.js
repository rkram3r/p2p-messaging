
export default (oldState = {
  contactlist: new Map(),
  message: '',
  id: '',
  name: '',
  recievedMessages: [],
}, action) => {
  const { type, ...rest } = action;
  if (type === 'PEER_READY') {
    const { id, peer, name } = rest;
    const contactlist = new Map([...oldState.contactlist]);
    contactlist.set(id, {
      peer, name, buddy: true, state: 'PEER_READY',
    });
    return { ...oldState, contactlist };
  }

  if (type === 'CONNECTING_PEER') {
    const { key, peer } = rest;
    const contactlist = new Map([...oldState.contactlist]);
    contactlist.set(key, {
      ...contactlist.get(key), peer, buddy: false, state: 'CONNECTING_PEER',
    });
    return { ...oldState, contactlist };
  }

  if (type === 'SET_PEER_READY') {
    const { key, peer } = rest;
    const contactlist = new Map([...oldState.contactlist]);
    contactlist.set(key, {
      ...contactlist.get(key), peer, buddy: false, state: 'PEER_READY',
    });
    return { ...oldState, contactlist };
  }

  if (type === 'ASK_TO_CONNECT') {
    const { id, connection } = rest;
    const contactlist = new Map([...oldState.contactlist]);
    contactlist.set(id, { ...contactlist.get(id), state: 'ASK_TO_CONNECT', connection });
    return { ...oldState, contactlist };
  }

  if (type === 'MESSAGE') {
    const { message, from } = rest;
    const { name } = oldState.contactlist.get(from);
    const recievedMessages = [...oldState.recievedMessages,
      { name, message, recieved: new Date() }];
    return { ...oldState, recievedMessages };
  }

  if (type === 'PUBLIC_KEY') {
    const { id, name } = rest;
    return { ...oldState, id, name };
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
