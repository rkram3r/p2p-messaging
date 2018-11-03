
import io from 'socket.io-client';
import Peer from 'simple-peer';

const maxOffers = 8;

export const createConnection = (myName, address) => async (dispatch) => {
  const socket = io(address, { transports: ['websocket'], secure: true });
  const offers = await Promise.all(new Array(maxOffers)
    .fill()
    .map((_, id) => new Promise((resolve) => {
      const offer = new Peer({ initiator: true, trickle: false });
      offer.on('connect', () => console.log('connect.'));
      offer.on('signal', data => resolve({
        data, id, name: myName, offer,
      }));
      offer.on('error', err => console.log(err));
    })));
  console.log(offers);
  socket.emit('register', offers.map(({ offer, ...rest }) => (rest)));
  socket.on('answer', ({ id, data }) => {
    const { offer } = offers[id];
    offer.signal(data);
    console.log(offer, data);
  });
  const connections = new Set();
  socket.on('register', ({
    name, data, from, id,
  }) => {
    if (!connections.has(from)) {
      connections.add(from);
      const peer = new Peer({ trickle: false });
      peer.on('connect', () => {
        console.log('connect.');
        dispatch({ type: 'NEW_PEER', name, peer });
      });
      peer.on('signal', answer => socket.emit('answer', {
        data: answer, name: myName, id, to: from,
      }));
      console.log(data);
      peer.signal(data);
      peer.on('error', err => console.log(err));
    }
  });

  /*
  const left = new Peer({ initiator: true, trickle: false });
  const right = new Peer({ trickle: false });

  socket.on('p2p-connect', ({ name, data }) => {
    const peer = data.type === 'answer' ? left : right;
    peer.signal(data);
    peer.on('connect', () => {
      if (data.type !== 'answer') {
        socket.close();
      }
      dispatch({ type: 'NEW_PEER', name, peer });
    });
    peer.on('data', message => dispatch(JSON.parse(message)));
  });
*/
  // left.on('signal', data => socket.emit('p2p-connect', { data, name: myName }));
  // right.on('signal', data => socket.emit('p2p-connect', { data, name: myName }));
};

export const onMessageChange = message => (dispatch) => {
  dispatch({ type: 'MESSAGE_CHANGE', message });
};

export const broadcast = (contactlist, message) => (dispatch) => {
  contactlist.forEach(({ peer }) => peer.send(JSON.stringify({ type: 'MESSAGE', message })));
  dispatch({ type: 'SEND_MESSAGE', message });
};

export const broadcastContactlist = (peer, contactlist) => () => {
  // create an offer over another peer
  peer.send(JSON.stringify({ type: 'CONTACTLIST', contactlist }));
};

export const connectionChange = connection => (dispatch) => {
  dispatch({ type: 'CONNECTION_CHANGE', connection });
};
