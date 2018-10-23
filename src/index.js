import 'babel-polyfill';
import queryString from 'query-string';
import PeerAdapter from './PeerAdapter';
import './index.scss';

const getElementById = id => document.getElementById(id);

const setDefaultHost = () => {
  const host = location.search.includes('heroku') ? 'https://p2p-messaging.herokuapp.com' : 'localhost:3030';
  getElementById('connectToValue').value = host;
};

setDefaultHost();

const listenOnMessages = (p2pAdapter) => {
  p2pAdapter.listenOn('message', (data) => {
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble-other';
    bubble.innerText = data;
    getElementById('messages').appendChild(bubble);
  });
};

const listenOnNewPeers = (p2pAdapter) => {
  p2pAdapter.listenOn('contactList', () => {
    const { peers } = p2pAdapter;
    getElementById('peers').innerHTML = '';
    Object.keys(p2pAdapter.peers)
      .filter((value, index, self) => self.indexOf(value) === index)
      .forEach((key) => {
        if (peers[key]._channelReady) {
          const a = document.createElement('a');
          a.classList = ['list-group-item-action', 'list-group-item'];
          a.setAttribute('href', `#sendTo=${key}`);
          a.appendChild(document.createTextNode(key));
          getElementById('peers').appendChild(a);
        }
      });
  });
};

const submitPeerId = (p2pAdapter) => {
  p2pAdapter.broadcast('contactList', p2pAdapter.peerId);
};

const sendMessage = (p2pAdapter) => {
  getElementById('send').addEventListener('click', () => {
    const { value } = getElementById('message');
    const { sendTo } = queryString.parse(location.hash);
    if (sendTo) {
      console.log(p2pAdapter.peers, sendTo);
      p2pAdapter.p2p.emitOne('message', value, sendTo);
    } else {
      p2pAdapter.broadcast('message', value);
    }

    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble-me';
    bubble.innerText = value;
    getElementById('messages').appendChild(bubble);
  });
};
const join = (p2pAdapter) => {
  getElementById('connect').addEventListener('click', () => {
    const { value } = getElementById('connectToValue');
    p2pAdapter.joinPeers(value);
  });
};

getElementById('connect').addEventListener('click', async () => {
  const { value } = getElementById('connectToValue');
  new PeerAdapter(value, [
    listenOnMessages,
    listenOnNewPeers,
    submitPeerId,
    sendMessage,
    join,
  ]);
});
