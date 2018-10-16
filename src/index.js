import "babel-polyfill";
import PeerAdapter from "./PeerAdapter";
import "./index.scss";
(() => {
  let p2p;
  const getElementById = id => document.getElementById(id);

  getElementById("connect").addEventListener("click", async () => {
    const { value } = getElementById("connectToValue");
    p2p = new PeerAdapter(value, { numClients: 10, channelName: "a" });
    const isReady = await p2p.isReady();
    if (isReady) {
      Object.keys(p2p.peers).forEach(peerId => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.appendChild(document.createTextNode(peerId.slice(0, 10)));
        getElementById("peers").appendChild(li);
      });

      const message = await p2p.listenOnMessage("peer-msg");
      const bubble = document.createElement("div");
      bubble.className = "speech-bubble";
      bubble.innerText = message;
      getElementById("messages").appendChild(bubble);
    }
  });

  getElementById("send").addEventListener("click", async () => {
    const isReady = await p2p.isReady();
    if (isReady) {
      const { value } = getElementById("message");
      p2p.broadcast("peer-msg", value);
    }
  });
})();
