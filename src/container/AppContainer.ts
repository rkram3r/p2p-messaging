import { Container } from "unstated";
import { sha256 } from "js-sha256";
import { ChannelType, ContactStatus } from "./models/IChannel";
import IContact, { IContactInformation } from "./models/IContact";
import IMessage from "./models/IMessage";
import IOverlayNetwork from "./models/IOverlayNetwork";

type State = {
  contactlist: Map<string, IContact>;
  myId: string;
  name: string;
  messages: Array<IMessage>;
  overlayNetwork: IOverlayNetwork<IContact>;
};

export default class AppContainer extends Container<State> {
  state = {
    contactlist: new Map<string, IContact>(),
    myId: "",
    name: "",
    messages: new Array<IMessage>(),
    overlayNetwork: null
  };

  constructor(overlayNetwork: IOverlayNetwork<IContact>) {
    super();
    this.setState({ overlayNetwork });
  }
  send(message: string, reciever?: Array<string>) {
    const timeStamp = new Date().getTime();
    const id = sha256(message + `${timeStamp}`);
    const newMessage = { from: this.state.myId, id, message, timeStamp };

    Array.from(this.state.contactlist).forEach(([_, { channels }]) => {
      const { peer } = channels.get(ChannelType.SendMessages);
      peer.send(JSON.stringify(newMessage));
    });

    const messages = [...this.state.messages, newMessage];
    this.setState({ messages });
  }

  connectTo(peerId: string) {}
  setupConnection(peerId: string) {}

  getChannelActionMapping() {
    const actions = new Map<ChannelType, (data: string) => void>();

    actions.set(ChannelType.Contactlist, data => {
      const { newPeers, from } = JSON.parse(data);
      const { rootPeer } = this.state.contactlist.get(from);

      const contactlist = new Map<string, IContact>([
        ...newPeers.map((contact: IContactInformation) => [
          contact.id,
          { ...contact, status: ContactStatus.NotConnected, rootPeer }
        ]),
        ...Array.from(this.state.contactlist)
      ]);
      this.setState({ contactlist });
    });

    actions.set(ChannelType.SendMessages, (data: string) => {
      const message = JSON.parse(data);
      const messages = [...this.state.messages, message];
      this.setState({ messages });
    });

    return actions;
  }

  sendContacts(contact: IContact) {
    const contactChannel = contact.channels.get(ChannelType.Contactlist);
    const newPeers = Array.from(this.state.contactlist)
      .filter(([key]) => !(key === contact.id || key === this.state.myId))
      .map(([_, { name, id }]) => ({ id, name }));
    if (newPeers.length !== 0) {
      const { peer } = contactChannel;
      peer.on("connect", () => {
        peer.send(
          JSON.stringify({
            newPeers,
            from: this.state.myId
          })
        );
      });
    }
  }

  bootstrap(address: string, name: string) {
    const id = sha256(name);
    const from = { name, id };
    const event = this.state.overlayNetwork.bootstrap(
      address,
      from,
      this.getChannelActionMapping()
    );

    event.on((contact: IContact) => {
      const { contactlist } = this.state;
      contact.setup();
      contactlist.set(contact.id, contact);
      this.setState({ myId: id, name, contactlist: new Map(contactlist) });
      this.sendContacts(contact);
    });
  }
}
