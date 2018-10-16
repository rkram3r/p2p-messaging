import "babel-polyfill";
import PeerAdapter from "./PeerAdapter";
import "./index.scss";

let p2p;
const getElementById = id => document.getElementById(id);

const listenOnMessages = async p2pAdapter => {
  const message = await p2pAdapter.listenOn("message");
  const bubble = document.createElement("div");
  bubble.className = "speech-bubble-other";
  bubble.innerText = message;
  getElementById("messages").appendChild(bubble);
};

const listenOnNewPeers = async p2pAdapter => {
  const newContact = await p2pAdapter.listenOn("contactList");
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.appendChild(document.createTextNode(newContact));
  getElementById("peers").appendChild(li);
};

const submitPeerId = async p2pAdapter => {
  p2pAdapter.broadcast("contactList", p2pAdapter.peerId);
};

getElementById("connect").addEventListener("click", async () => {
  const { value } = getElementById("connectToValue");
  p2p = new PeerAdapter(value, [
    listenOnMessages,
    listenOnNewPeers,
    submitPeerId
  ]);
});

getElementById("send").addEventListener("click", async () => {
  const { value } = getElementById("message");
  p2p.broadcast("message", value);

  const bubble = document.createElement("div");
  bubble.className = "speech-bubble-me";
  bubble.innerText = value;
  getElementById("messages").appendChild(bubble);
});
