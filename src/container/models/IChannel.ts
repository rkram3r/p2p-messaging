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

export default interface IChannel {
  peer?: Peer.Instance;
  status: ContactStatus;
}
