import PeerAdapter from "./PeerAdapter";

const p2p = new PeerAdapter("localhost:3030", { numClients: 10 });
const box = document.getElementById("msg-box");
const form = document.getElementById("msg-form");
form.addEventListener("submit", e => {
  e.preventDefault();
  p2p.broadcast("peer-msg", { text: box.value });
});

p2p.listenOnMessage("peer-msg").then(message => console.log(message));

console.log(p2p.getKnownPeers());
