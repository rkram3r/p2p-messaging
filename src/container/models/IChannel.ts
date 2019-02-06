import Peer from "simple-peer";

export enum ChannelType {
  RootChannel = 1,
  Contactlist = 2,
  Messages = 4
}

export enum ChannelState {
  NotConnected,
  AskToConnect,
  Connecting,
  Ready,
  Error
}

export default interface IChannel {
  peer: Peer.Instance;
  peerId: string;
  state: ChannelState;
  channelType: ChannelType;
}
