import Peer from "simple-peer";

export enum ChannelType {
  RootChannel,
  Contactlist
}

export enum ContactStatus {
  NotConnected = 1,
  AskToConnect = 2,
  Connecting = 4,
  Ready = 8
}

export interface IChannel {
  peer?: Peer.Instance;
  status: ContactStatus;
}

export default interface IContact {
  name: string;
  id: string;
  channels?: Map<ChannelType, IChannel>;
}
