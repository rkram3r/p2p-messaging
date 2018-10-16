import "babel-polyfill";
import PeerAdapter from "./PeerAdapter";
import "./index.scss";

const getElementById = id => document.getElementById(id);

const listenOnMessages = p2pAdapter => {
  p2pAdapter.listenOn("message", data => {
    const bubble = document.createElement("div");
    bubble.className = "speech-bubble-other";
    bubble.innerText = data;
    getElementById("messages").appendChild(bubble);
  });
};

const listenOnNewPeers = p2pAdapter => {
  p2pAdapter.listenOn("contactList", data => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.appendChild(document.createTextNode(data));
    getElementById("peers").appendChild(li);
  });
};

const submitPeerId = p2pAdapter => {
  p2pAdapter.broadcast("contactList", p2pAdapter.peerId);
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

getElementById("connect").addEventListener("click", async () => {
  const { value } = getElementById("connectToValue");
  new PeerAdapter(value, [
    listenOnMessages,
    listenOnNewPeers,
    submitPeerId,
    sendMessage
  ]);
});
