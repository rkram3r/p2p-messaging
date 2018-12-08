
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
    const { message, from, messageId } = rest;
    const contact = oldState.contactlist.get(from);
    console.log(messageId);
    const recievedMessages = [...oldState.recievedMessages,
      {
        message,
        recieved: new Date(),
        verified: false,
        messageId,
        ...contact,
        myMessage: false,
      }];
    return { ...oldState, recievedMessages };
  }

  if (type === 'PUBLIC_KEY') {
    const { id, name } = rest;
    return { ...oldState, id, name };
  }

  if (type === 'MESSAGE_CHANGE') {
    return { ...oldState, ...rest };
  }

  if (type === 'VERIFIED') {
    const { messageId } = rest;
    console.log(rest);
    console.log(oldState.recievedMessages, messageId);
    return {
      ...oldState,
      recievedMessages:
      oldState.recievedMessages.map(x => (x.messageId === messageId ? { ...x, verified: true } : x)),
    };
  }
  if (type === 'ERROR') {
    console.log(rest);
    return { ...oldState, ...rest };
  }

  if (type === 'CONTACTLIST') {
    const { contactlist } = rest;
    return { ...oldState, contactlist: new Map([...contactlist, ...oldState.contactlist]) };
  }

  if (type === 'SEND_MESSAGE') {
    const { message, messageId } = action;
    console.log(messageId);
    const recievedMessages = [...oldState.recievedMessages,
      {
        myMessage: true,
        message,
        recieved: new Date(),
        messageId,
        verified: false,
      }];
    return { ...oldState, recievedMessages, message: '' };
  }

  return oldState;
};
