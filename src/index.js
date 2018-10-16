import "babel-polyfill";
import PeerAdapter from "./PeerAdapter";
import "./index.scss";

const getElementById = id => document.getElementById(id);
const confirmationInMilliseconds = 3000;

const listenOnMessages = p2pAdapter => {
  p2pAdapter.listenOn("message", data => {
    const bubble = document.createElement("div");
    bubble.className = "speech-bubble-other";
    bubble.innerText = data;
    getElementById("messages").appendChild(bubble);
  });
};

const listenOnNewPeers = p2pAdapter => {
  const peers = new Map();
  const refreshRate = 2000;
  p2pAdapter.listenOn("contactList", data => {
    peers.set(data, new Date());
    setInterval(() => {
      getElementById("peers").innerHTML = "";
      Array.from(peers).forEach(([key, value]) => {
        if (value > new Date().setMilliseconds(-confirmationInMilliseconds)) {
          const li = document.createElement("li");
          li.className = "list-group-item";
          li.appendChild(document.createTextNode(key));
          getElementById("peers").appendChild(li);
        }
      });
    }, refreshRate);
  });
};

const submitPeerId = p2pAdapter => {
  setInterval(() => {
    p2pAdapter.broadcast("contactList", p2pAdapter.peerId);
  }, confirmationInMilliseconds);
};

const sendMessage = p2pAdapter => {
  getElementById("send").addEventListener("click", () => {
    const { value } = getElementById("message");
    p2pAdapter.broadcast("message", value);

    const bubble = document.createElement("div");
    bubble.className = "speech-bubble-me";
    bubble.innerText = value;
    getElementById("messages").appendChild(bubble);
  });
};
const join = p2pAdapter => {
  getElementById("connect").addEventListener("click", () => {
    const { value } = getElementById("connectToValue");
    p2pAdapter.joinPeers(value);
  });
};

getElementById("connect").addEventListener("click", async () => {
  const { value } = getElementById("connectToValue");
  new PeerAdapter(value, [
    listenOnMessages,
    listenOnNewPeers,
    submitPeerId,
    sendMessage,
    join
  ]);
});
