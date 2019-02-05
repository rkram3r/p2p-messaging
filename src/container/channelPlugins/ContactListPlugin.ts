import IChannelPlugin from "./IChannelPlugin";
import { AppState } from "../AppContainer";
import IChannel, { ContactStatus } from "../models/IChannel";
import IContact, { IContactInformation } from "../models/IContact";

export class ContactListPlugin implements IChannelPlugin<AppState> {
  send(contact: IContactInformation, channel: IChannel, state: AppState) {
    const contactChannel = channel;
    const newPeers = Array.from(state.contactlist)
      .filter(([key]) => !(key === contact.id || key === state.myId))
      .map(([_, { name, id }]) => ({ id, name }));
    if (newPeers.length !== 0) {
      const { peer } = contactChannel;
      peer.on("connect", () => {
        peer.send(
          JSON.stringify({
            newPeers,
            from: state.myId
          })
        );
      });
    }

    return state;
  }

  onData(data: string, state: AppState) {
    const { newPeers, from } = JSON.parse(data);
    const { rootPeer } = state.contactlist.get(from);

    const contactlist = new Map<string, IContact>([
      ...newPeers.map((contact: IContactInformation) => [
        contact.id,
        { ...contact, status: ContactStatus.NotConnected, rootPeer }
      ]),
      ...Array.from(state.contactlist)
    ]);
    return { ...state, contactlist };
  }
}

export class MessagePlugin implements IChannelPlugin<AppState> {
  send(contact: IContactInformation, channel: IChannel, state: AppState) {
    channel.peer.on("data", data => {
      const message = JSON.parse(data);
      const messages = [...state.messages, message];
      return { ...state, messages };
    });
    return state;
  }

  onData(data: string, state: AppState) {
    const message = JSON.parse(data);
    const messages = [...state.messages, message];
    return { ...state, messages };
  }
}
