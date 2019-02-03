import { Container } from "unstated";
import { sha256 } from "js-sha256";

import { ChannelType } from "./models/IChannel";
import IContact from "./models/IContact";
import IMessage from "./models/IMessage";
import IOverlayNetwork from "./models/IOverlayNetwork";

type State = {
  contactlist: Map<string, IContact>;
  myId: string;
  name: string;
  messages: Array<IMessage>;
  overlayNetwork: IOverlayNetwork;
};

export default class AppContainer extends Container<State> {
  state = {
    contactlist: new Map<string, IContact>(),
    myId: "",
    name: "",
    messages: new Array<IMessage>(),
    overlayNetwork: null
  };

  constructor(overlayNetwork: IOverlayNetwork) {
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
    actions.set(ChannelType.Contactlist, data => console.log(data));
    actions.set(ChannelType.SendMessages, data => {
      const message = JSON.parse(data);
      const messages = [...this.state.messages, message];
      this.setState({ messages });
    });

    return actions;
  }

  async bootstrap(address: string, name: string) {
    const id = sha256(name);
    const addContact = (contact: IContact) => {
      const { contactlist } = this.state;
      const { channels } = contact;
      const { peer } = channels.get(ChannelType.RootChannel);
      contactlist.set(contact.id, contact);

      this.state.overlayNetwork.setupRootChannel(peer, contact.channels);
      this.state.overlayNetwork.setupChannels(peer, contact.channels);

      this.setState({ myId: id, name, contactlist: new Map(contactlist) });
    };

    this.state.overlayNetwork.bootstrap(
      address,
      { name, id },
      this.getChannelActionMapping(),
      addContact
    );
  }
}
