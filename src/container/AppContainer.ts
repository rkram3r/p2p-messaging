import { Container } from "unstated";
import { sha256 } from "js-sha256";

import { ChannelType } from "./models/IChannel";
import IContact from "./models/IContact";
import { bootstrap } from "./OverlayNetwork";
import IMessage from "./models/IMessage";

type State = {
  contactlist: Map<string, IContact>;
  myId: string;
  name: string;
  messages: Array<IMessage>;
};

export default class AppContainer extends Container<State> {
  state = {
    contactlist: new Map<string, IContact>(),
    myId: "",
    name: "",
    messages: new Array<IMessage>()
  };

  send(message: string, reciever?: Array<string>) {
    const timeStamp = new Date().getTime();
    const id = sha256(message + `${timeStamp}`);
    const newMessage = { from: this.state.myId, id, message, timeStamp };

    Array.from(this.state.contactlist).forEach(([_, { channels }]) => {
      const { peer } = channels.get(ChannelType.RootChannel);
      peer.send(JSON.stringify(newMessage));
    });

    const messages = [...this.state.messages, newMessage];
    this.setState({ messages });
  }

  connectTo(peerId: string) {}
  setupConnection(peerId: string) {}

  async bootstrap(address: string, name: string) {
    const id = sha256(name);
    const addContact = (contact: IContact) => {
      const { contactlist } = this.state;
      contactlist.set(contact.id, contact);
      const { peer } = contact.channels.get(ChannelType.RootChannel);
      peer.on("data", (data: string) => {
        const message: IMessage = JSON.parse(data);
        const messages = [...this.state.messages, message];

        this.setState({ messages });
      });
      this.setState({ myId: id, name, contactlist: new Map(contactlist) });
    };
    bootstrap(address, { name, id }, addContact);

    // request new peer connection
    // peer.on("data", data => {
    // ChannelType
    // signalingData

    // if !isInitiator --> create new Peer
    // .. signaling and send to other
    //});
  }
}

/*


const isInitiator = (id1: string, id2: string) =>
  Number.parseInt(id1, 16) > Number.parseInt(id2, 16);

export const setup = (from: IContact, contact: IContact) => {
  const peer = new Peer({ initiator: isInitiator(contact.id, from.id) });
  peer.on("connect", () => console.log("connected"));
  peer.on("signal", (signalingData: ISignalingData) =>
    // contact.peer.send(JSON.stringify({ signalingData, from }))
    ({})
  );

  //const peer = setup({ id, name }, contact);

  /*registerChannel(contact.peer, (data: string) => {
    const exchange = JSON.parse(data);

    channelFromPeer.set(exchange.channelType, {
      signalingData: exchange.signalingData
    });

    peer.signal(exchange.signalingData);
  });*/

//return peer;
//};
