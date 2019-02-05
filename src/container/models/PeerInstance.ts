import Peer from "simple-peer";
import { ChannelType } from "./IChannel";

export default class PeerInstance extends Peer {
  constructor(options: Peer.Options, public type: ChannelType) {
    super(options);
  }

  setup(rootPeer: Peer.Instance) {
    this.on("signal", signalingData => {
      rootPeer.send(JSON.stringify({ signalingData, type: this.type }));
    });
  }
}
