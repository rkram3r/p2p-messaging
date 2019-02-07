import { Container } from "unstated";
import IChannel, { ChannelType, ChannelState } from "./models/IChannel";
import IOverlayNetwork from "./models/IOverlayNetwork";
import Channels from "./models/Channels";

export default class ContactlistContainer extends Container<Channels> {
  state = {};

  constructor(private readonly overlayNetwork: IOverlayNetwork) {
    super();

    this.overlayNetwork.rootChannel.on(async contact => {
      const channel = await contact.createNewChannel(ChannelType.Contactlist);
      this.state[contact.peerId] = channel;
      this.setState(this.state);

      channel.peer.on("data", (data: string) => {
        const newPeers: IChannel[] = JSON.parse(data);
        newPeers.forEach(x => {
          this.state[x.peerId] = this.state[x.peerId] || {
            ...x,
            state: ChannelState.NotConnected
          };
        });
        this.setState(this.state);
      });
    });
  }
  connectTo(peerId: string) {}
  setupConnection(peerId: string) {}

  sendContactInformatoin(to: string) {
    const newPeers = Object.keys(this.state)
      .filter(peerId => peerId !== to)
      .map(peerId => ({
        peerId,
        name: this.state[peerId].name
      }));

    if (newPeers.length !== 0) {
      const { peer } = this.state[to];
      peer.send(JSON.stringify(newPeers));
    }
  }
}
