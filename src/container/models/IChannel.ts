import PeerInstance from "./PeerInstance";

export enum ChannelType {
  RootChannel = 1,
  Contactlist = 2,
  SendMessages = 4
}

export enum ContactStatus {
  NotConnected,
  AskToConnect,
  Connecting,
  Ready,
  Error
}

export default interface IChannel {
  peer: PeerInstance;
  status: ContactStatus;
}
