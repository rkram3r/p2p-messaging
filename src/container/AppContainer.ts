import { Container } from "unstated";
import { sha256 } from "js-sha256";
import { ChannelType, ContactStatus } from "./models/IChannel";
import IContact, { IContactInformation } from "./models/IContact";
import IOverlayNetwork from "./models/IOverlayNetwork";
import IMessage from "./models/IMessage";

export type AppState = {
  contactlist: Map<string, IContact>;
  myId: string;
  name: string;
  messages: Array<IMessage>;
};

export default class AppContainer extends Container<AppState> {
  state = {
    contactlist: new Map<string, IContact>(),
    myId: "",
    name: "",
    messages: new Array<IMessage>()
  };

  constructor(private readonly overlayNetwork: IOverlayNetwork<IContact>) {
    super();
  }

  connectTo(peerId: string) {}
  setupConnection(peerId: string) {}

  listenOnNewMessages(contact: IContact) {
    const { peer } = contact.channels.get(ChannelType.SendMessages);
    peer.on("data", (data: string) => {
      const message = JSON.parse(data);
      const messages = [...this.state.messages, message];
      this.setState({ messages });
    });
  }

  send(message: string) {
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

  sendContacts(
    contact: IContact,
    contactlist: Map<string, IContact>,
    from: string
  ) {
    const contactChannel = contact.channels.get(ChannelType.Contactlist);
    const newPeers = Array.from(contactlist)
      .filter(([key]) => key !== contact.id)
      .map(([_, { name, id }]) => ({ id, name }));

    if (newPeers.length !== 0) {
      const { peer } = contactChannel;
      peer.on("connect", () => {
        peer.send(JSON.stringify({ newPeers, from }));
      });
    }
  }

  registerContactChannel(contact: IContact) {
    const { peer } = contact.channels.get(ChannelType.Contactlist);
    peer.on("data", (data: string) => {
      const { newPeers, from } = JSON.parse(data);
      const { rootPeer } = this.state.contactlist.get(from);
      const mappedNewPeers = newPeers.map((contact: IContactInformation) => [
        contact.id,
        { ...contact, status: ContactStatus.NotConnected, rootPeer }
      ]);
      const contactlist = new Map<string, IContact>([
        ...mappedNewPeers,
        ...Array.from(this.state.contactlist)
      ]);

      this.setState({ contactlist });
    });
  }

  bootstrap(address: string, name: string) {
    const id = sha256(name);
    const from = { name, id };
    const event = this.overlayNetwork.bootstrap(address, from, [
      ChannelType.Contactlist,
      ChannelType.SendMessages
    ]);

    event.on((contact: IContact) => {
      const { contactlist } = this.state;
      contactlist.set(contact.id, contact);
      this.registerContactChannel(contact);
      this.listenOnNewMessages(contact);
      this.setState({
        myId: id,
        name,
        contactlist: new Map(contactlist)
      });

      this.sendContacts(contact, contactlist, id);
    });
  }
}
