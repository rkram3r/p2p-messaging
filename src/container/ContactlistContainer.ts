import { Container } from "unstated";
import { ChannelType } from "./models/IChannel";
import IOverlayNetwork from "./models/IOverlayNetwork";
import IContactInformation from "./models/IContactInformation";
import Channels from "./models/Channels";

class Contactlist {
  [peerId: string]: IContactInformation;
}

type ContactlistState = {
  contactlist: Contactlist;
  channels: Channels;
};

export default class AppContainer extends Container<ContactlistState> {
  state = {
    contactlist: new Contactlist(),
    channels: new Channels()
  };

  constructor(private readonly overlayNetwork: IOverlayNetwork) {
    super();

    this.overlayNetwork.channels.on(channel => {
      if (!this.state.channels[channel.peerId]) {
        this.state.channels[channel.peerId] = {};
      }
      this.state.channels[channel.peerId][channel.channelType] = channel;
      this.setState({ channels: this.state.channels });
    });

    this.overlayNetwork.rootChannel.on(contact => {
      this.state.contactlist[contact.peerId] = contact;
      this.setState({ contactlist: this.state.contactlist });
      this.overlayNetwork.createNewChannel(contact, ChannelType.Contactlist);
    });

    this.overlayNetwork.channels.on(channel => {
      if (channel.channelType === ChannelType.Contactlist) {
        channel.peer.on("data", (data: string) => {
          const newPeers: IContactInformation[] = JSON.parse(data);
          newPeers.forEach(x => {
            const contact = this.state.contactlist[x.peerId] || x;
            this.state.contactlist[x.peerId] = contact;
          });

          this.setState({
            contactlist: this.state.contactlist
          });
        });
        const { contactlist } = this.state;
        const newPeers = Object.keys(contactlist)
          .filter(peerId => !(peerId === channel.peerId))
          .map(x => ({
            peerId: this.state.contactlist[x].peerId,
            name: this.state.contactlist[x].name
          }));

        if (newPeers.length !== 0) {
          const { peer } = channel;
          peer.send(JSON.stringify(newPeers));
        }
      }
    });
  }
  connectTo(peerId: string) {}
  setupConnection(peerId: string) {}
}
