import 'babel-polyfill';
import queryString from 'query-string';
import PeerAdapter from './PeerAdapter';
import './index.scss';

const getElementById = id => document.getElementById(id);

const setDefaultHost = () => {
  const host = location.search.includes('heroku') ? 'name@https://p2p-messaging.herokuapp.com' : 'name@localhost:3030';
  getElementById('connectToValue').value = host;
};

setDefaultHost();

const listenOnMessages = (p2pAdapter) => {
  p2pAdapter.listenOn('message', (message) => {
    const { name, value } = message;
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble-other';
    bubble.innerText = `${name}\n${value}`;
    getElementById('messages').appendChild(bubble);
  });
};

const listenOnNewPeers = (p2pAdapter) => {
  p2pAdapter.listenOn('contactList', (newPeer) => {
    const { peerId, name } = newPeer;
    if (p2pAdapter.peers[peerId] && p2pAdapter.peers[peerId]._channelReady) {
      const a = document.createElement('a');
      a.classList = ['list-group-item-action', 'list-group-item'];
      a.setAttribute('href', `#sendTo=${peerId}`);
      a.appendChild(document.createTextNode(name));
      getElementById('peers').appendChild(a);
    }
  });
};

const sendMessage = (p2pAdapter) => {
  getElementById('send').addEventListener('click', () => {
    const { value } = getElementById('message');
    if (value === '') {
      return;
    }
    const { sendTo } = queryString.parse(location.hash);
    if (sendTo) {
      p2pAdapter.sendTo('message', { value, name: p2pAdapter.name }, sendTo);
    } else {
      p2pAdapter.broadcast('message', { value, name: p2pAdapter.name });
    }


    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble-me';
    bubble.innerText = `${p2pAdapter.name}\n${value}`;
    getElementById('messages').appendChild(bubble);
    getElementById('message').value = '';
  });
};

const join = (p2pAdapter) => {
  getElementById('connect').addEventListener('click', () => {
    const { value } = getElementById('connectToValue');
    p2pAdapter.joinPeers(value);
  });
};


const submitPeerId = (p2pAdapter) => {
  const { peerId, name } = p2pAdapter;
  p2pAdapter.broadcast('contactList', { peerId, name });
};


getElementById('connect').addEventListener('click', async () => {
  const { value } = getElementById('connectToValue');
  const [name, address] = value.split('@');
  const peerAdapter = new PeerAdapter(address, name, [
    listenOnMessages,
    listenOnNewPeers,
    submitPeerId,
  ]);

  sendMessage(peerAdapter);
  join(peerAdapter);
});
