import { Container } from "unstated";
import { sha256 } from "js-sha256";
import { ChannelType, ContactStatus } from "./models/IChannel";
import IContact from "./models/IContact";
import IMessage from "./models/IMessage";
import IOverlayNetwork from "./models/IOverlayNetwork";
import IChannelPlugin from "./channelPlugins/IChannelPlugin";

export type AppState = {
  contactlist: Map<string, IContact>;
  myId: string;
  name: string;
  messages: Array<IMessage>;
  overlayNetwork?: IOverlayNetwork<IContact>;
  plugins?: Map<ChannelType, IChannelPlugin<AppState>>;
};

export default class AppContainer extends Container<AppState> {
  state = {
    contactlist: new Map<string, IContact>(),
    myId: "",
    name: "",
    messages: new Array<IMessage>(),
    overlayNetwork: null,
    plugins: new Map<ChannelType, IChannelPlugin<AppState>>()
  };

  constructor(
    overlayNetwork: IOverlayNetwork<IContact>,
    plugins: Map<ChannelType, IChannelPlugin<AppState>>
  ) {
    super();
    this.setState({ overlayNetwork, plugins: new Map(plugins) });
  }
  send(message: string, reciever?: Array<string>) {
    const timeStamp = new Date().getTime();
    const id = sha256(message + `${timeStamp}`);
    const newMessage = { from: this.state.myId, id, message, timeStamp };

    Array.from(this.state.contactlist).forEach(([_, { channels, status }]) => {
      if (status === ContactStatus.Ready) {
        const { peer } = channels.get(ChannelType.SendMessages);
        peer.send(JSON.stringify(newMessage));
      }
    });

    const messages = [...this.state.messages, newMessage];
    this.setState({ messages });
  }

  connectTo(peerId: string) {}
  setupConnection(peerId: string) {}

  registerToChannels(contact: IContact) {
    this.state.plugins;
    contact.channels.forEach((value, key) => {
      const { peer } = value;
      if (this.state.plugins.has(key)) {
        peer.on("data", (data: string) =>
          this.setState(this.state.plugins.get(key).onData(data, this.state))
        );
      }
    });
  }

  sendContacts(contact: IContact) {
    this.setState(
      this.state.plugins
        .get(ChannelType.Contactlist)
        .send(
          contact,
          contact.channels.get(ChannelType.Contactlist),
          this.state
        )
    );
  }

  bootstrap(address: string, name: string) {
    const id = sha256(name);
    const from = { name, id };
    const event = this.state.overlayNetwork.bootstrap(address, from, [
      ChannelType.Contactlist,
      ChannelType.SendMessages
    ]);

    event.on(async (contact: IContact) => {
      const { contactlist } = this.state;
      contactlist.set(contact.id, contact);
      this.registerToChannels(contact);
      await this.setState({
        myId: id,
        name,
        contactlist: new Map(contactlist)
      });
      this.sendContacts(contact);
    });
  }
}
