
export default (oldState = {
  contactlist: new Map(), message: '', recievedMessages: [],
}, action) => {
  const { type, ...rest } = action;

  if (type === 'NEW_PEER') {
    const { peer, name, id } = rest;
    const contactlist = new Map([...oldState.contactlist]);
    contactlist.set(id, { peer, name });
    return { ...oldState, contactlist };
  }

  if (type === 'MESSAGE') {
    const { name, message } = rest;
    console.log(rest);
    const recievedMessages = [...oldState.recievedMessages,
      { name, message, recieved: new Date() }];
    return { ...oldState, recievedMessages };
  }

  if (type === 'PUBLIC_KEY') {
    return { ...oldState, ...rest };
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
