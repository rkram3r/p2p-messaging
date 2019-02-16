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

export interface IContact extends IChannel {
  createNewChannel(type: ChannelType): Promise<IChannel>;
}

export default interface IChannel {
  peer?: Peer.Instance;
  peerId: number;
  name: string;
}
