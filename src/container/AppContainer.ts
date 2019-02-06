import { Container } from "unstated";
import IChannel, { ChannelType } from "./models/IChannel";
import IOverlayNetwork from "./models/IOverlayNetwork";
import IMessage from "./models/IMessage";
import { sha256 } from "js-sha256";
import IContactInformation from "./models/IContactInformation";

class Channels {
  [id: string]: {
    [type: number]: IChannel;
  };
}

class Contactlist {
  [peerId: string]: IContactInformation;
}
export type AppState = {
  contactlist: Contactlist;
  myId: string;
  name: string;
  messages: Array<IMessage>;
  channels: Channels;
};

export default class AppContainer extends Container<AppState> {
  state = {
    contactlist: new Contactlist(),
    myId: "",
    name: "",
    messages: new Array<IMessage>(),
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
    this.overlayNetwork.channels.on(channel => {
      if (channel.channelType === ChannelType.Messages) {
        channel.peer.on("data", newMessages => {
          this.setState({
            messages: [...this.state.messages, JSON.parse(newMessages)]
          });
        });
      }
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
          .filter(
            peerId => !(peerId === channel.peerId || peerId === this.state.myId)
          )
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

  send(message: string) {
    const timeStamp = new Date().getTime();
    const id = sha256(message + `${timeStamp}`);
    const newMessage = { from: this.state.myId, id, message, timeStamp };
    console.log(message);
    Object.keys(this.state.contactlist).forEach(to => {
      const { peer } = this.state.channels[to][ChannelType.Messages];
      peer.send(JSON.stringify({ newMessage }));
    });
  }

  bootstrap(address: string, name: string) {
    const id = this.overlayNetwork.bootstrap(address, name);
    this.setState({ myId: id, name });
    this.overlayNetwork.rootChannel.on(contact => {
      this.state.contactlist[contact.peerId] = contact;
      this.setState({ contactlist: this.state.contactlist });
      this.overlayNetwork.createNewChannel(contact, ChannelType.Contactlist);
      this.overlayNetwork.createNewChannel(contact, ChannelType.Messages);
    });
  }
}
