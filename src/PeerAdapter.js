import P2P from "socket.io-p2p";
import io from "socket.io-client";

export default class PeerAdapter {
  constructor(address, listeners, options) {
    const socket = io(address);
    this.p2p = new P2P(socket, options);
    this.p2p.on("upgrade", () => {
      listeners.map(f => f(this));
    });
  }

  joinPeers(address, options) {
    const socket = io(address);
    const otherPeer = new P2P(socket, options);
    this.p2p._peers = { ...this.p2p._peers, ...otherPeer._peers };
  }

  listenOn(channel, next) {
    this.p2p.on(channel, next);
  }

  broadcast(channel, message) {
    this.p2p.emit(channel, message);
  }

  sendMessage(message, peerId) {
    this.p2p[peerId].signal(message);
  }

  get peers() {
    return this.p2p._peers;
  }

  get peerId() {
    return this.p2p.peerId;
  }
}
