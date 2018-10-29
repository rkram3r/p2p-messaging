
export default (oldState = {
  peers: [], message: '', recievedMessages: [],
}, action) => {
  const { type, ...rest } = action;

  if (type === 'NEW_PEER') {
    const { peer, name } = rest;
    const peers = [...oldState.peers, { peer, name, id: peer._id }];
    return { ...oldState, peers };
  }

  if (type === 'RECIEVE_MESSAGE') {
    const { name, message } = rest;
    const recievedMessages = [...oldState.recievedMessages, { name, message, recieved: new Date() }];
    return { ...oldState, recievedMessages };
  }

  if (type === 'MESSAGE_CHANGE') {
    return { ...oldState, ...rest };
  }
  if (type === 'SEND_MESSAGE') {
    const { message } = action;
    const recievedMessages = [...oldState.recievedMessages, { myMessage: true, message, recieved: new Date() }];
    return { ...oldState, recievedMessages, message: '' };
  }

  return oldState;
};
