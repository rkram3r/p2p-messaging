import Peer from "simple-peer";
import { ContactStatus, ChannelType } from "./IChannel";

export default class PeerInstance extends Peer {
  constructor(
    options: Peer.Options,
    public type: ChannelType,
    public action: (data: string) => void
  ) {
    super(options);
    this.on("data", x => action(x));
  }

  setup(rootPeer: Peer.Instance) {
    this.on("signal", signalingData => {
      rootPeer.send(JSON.stringify({ signalingData, type: this.type }));
    });
    this.on("connect", () => console.log(this.type, "ready"));
    this.on("error", error => console.log(this.type, ContactStatus.Error));
  }
}
