import { Container } from "unstated";
import Peer from "simple-peer";
import IChannel, { ChannelType, ChannelState } from "./models/IChannel";
import IOverlayNetwork from "./models/IOverlayNetwork";

type ContactInformation = {
  peerId: number;
  name: string;
  state?: ChannelState;
  peer?: Peer.Instance;
};

type Contacts = {
  [peerId: number]: ContactInformation;
};

export default class ContactlistContainer extends Container<Contacts> {
  state = {};

  constructor(private readonly overlayNetwork: IOverlayNetwork) {
    super();
    this.overlayNetwork.networkState.once(state => {
      this.state[this.overlayNetwork.peerId] = {
        peerId: this.overlayNetwork.peerId,
        name: this.overlayNetwork.name,
        state
      };
    });
    this.overlayNetwork.contacts.on(async contact => {
      const channel = await contact.createNewChannel(ChannelType.Contactlist);
      this.state[contact.peerId] = {
        ...channel,
        state: ChannelState.Ready
      };
      await this.setState(this.state);
      this.listenForNewContactinformations(channel);
      this.sendContactinformations();
    });
  }

  private listenForNewContactinformations(channel: IChannel) {
    channel.peer.on("data", async (data: string) => {
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
        await this.setState(newState);
        this.sendContactinformations();
      }
    });
  }

  private sendContactinformations() {
    const peers = this.contacts.map(({ name, peerId }) => ({
      peerId,
      name
    }));

    this.contacts
      .filter(
        ({ peer, peerId }) => peer && peerId !== this.overlayNetwork.peerId
      )
      .forEach(({ peer }) => peer.send(JSON.stringify(peers)));
  }

  get contacts() {
    return Object.keys(this.state).map(peerId => this.state[peerId]);
  }

  get any() {
    return this.contacts.length !== 0;
  }
}
