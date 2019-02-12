import { Container } from "unstated";
import IChannel, { ChannelType, ChannelState } from "./models/IChannel";
import IOverlayNetwork from "./models/IOverlayNetwork";
import Channels from "./models/Channels";

type ContactInformation = {
  peerId: string;
  name: string;
  from: string;
};

export default class ContactlistContainer extends Container<Channels> {
  state = {};

  constructor(private readonly overlayNetwork: IOverlayNetwork) {
    super();

    this.overlayNetwork.rootChannel.on(async contact => {
      const channel = await contact.createNewChannel(ChannelType.Contactlist);
      this.state[contact.peerId] = channel;
      this.setState(this.state);
      this.sendContactinformations();
      this.listenForNewContactinformations(channel);
    });
  }

  private listenForNewContactinformations(channel: IChannel) {
    channel.peer.on("data", (data: string) => {
      const peers: ContactInformation[] = JSON.parse(data);
      const newPeers = peers.filter(
        ({ peerId }) =>
          !(this.state[peerId] || peerId === this.overlayNetwork.peerId)
      );

      if (newPeers.length !== 0) {
        const newState = newPeers.reduce(
          (p, c) => ({
            ...p,
            [c.peerId]: { ...c, state: ChannelState.NotConnected }
          }),
          this.state
        );
        this.setState(newState);
        this.sendContactinformations();
      }
    });
  }

  private sendContactinformations() {
    const peers = Object.keys(this.state).map(
      peerId =>
        ({
          peerId,
          name: this.state[peerId].name,
          from: this.overlayNetwork.peerId
        } as ContactInformation)
    );

    Object.keys(this.state).forEach(peerId => {
      const { peer } = this.state[peerId];
      if (peer) {
        peer.send(JSON.stringify(peers.filter(({ from }) => from !== peerId)));
      }
    });
  }
}
