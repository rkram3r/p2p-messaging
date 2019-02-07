import { Container } from "unstated";
import IChannel, { ChannelType, ChannelState } from "./models/IChannel";
import IOverlayNetwork from "./models/IOverlayNetwork";
import Channels from "./models/Channels";

type ContactlistState = {
  channels: Channels;
};

export default class ContactlistContainer extends Container<ContactlistState> {
  state = {
    channels: new Channels()
  };

  constructor(private readonly overlayNetwork: IOverlayNetwork) {
    super();

    this.overlayNetwork.rootChannel.on(async contact => {
      const channel = await contact.createNewChannel(ChannelType.Contactlist);
      this.state.channels[contact.peerId] = channel;
      this.setState({ channels: this.state.channels });

      channel.peer.on("data", (data: string) => {
        const newPeers: IChannel[] = JSON.parse(data);
        newPeers.forEach(x => {
          this.state.channels[x.peerId] = this.state.channels[x.peerId] || x;
        });

        this.setState({ channels: this.state.channels });
      });
      const { channels } = this.state;
      const newPeers = Object.keys(channels)
        .filter(peerId => peerId !== channel.peerId)
        .map(peerId => ({
          peerId,
          name: channels[peerId].name,
          state: ChannelState.NotConnected
        }));

      if (newPeers.length !== 0) {
        const { peer } = channel;
        peer.send(JSON.stringify(newPeers));
      }
    });
  }
  connectTo(peerId: string) {}
  setupConnection(peerId: string) {}
}
