import IChannel, { ChannelType, ContactStatus } from "./IChannel";
import Peer from "simple-peer";

export interface IContactInformation {
  name: string;
  id: string;
}

export default interface IContact extends IContactInformation {
  rootPeer: Peer.Instance;
  status: ContactStatus;
  channels: Map<ChannelType, IChannel>;
}
