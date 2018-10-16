import P2P from "socket.io-p2p";
import io from "socket.io-client";

export default class PeerAdapter {
  constructor(address, options) {
    const socket = io(address);
    this.p2p = new P2P(socket, options);
  }

  joinPeers(address, options) {
    const socket = io(address);
    const otherPeer = new P2P(socket, options);
    this.p2p._peers = { ...this.p2p._peers, ...otherPeer._peers };
  }

  listenOnMessage(dataChannel) {
    return new Promise(resolve => {
      this.p2p.on(dataChannel, data => {
        resolve(data);
      });
    });
  }

  broadcast(channel, message) {
    this.p2p.emit(channel, message);
  }

  sendMessage(message, peerId) {
    this.p2p[peerId].signal(message);
  }

  getKnownPeers() {
    return this.p2p._peers;
  }
}
