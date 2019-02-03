import Peer from "simple-peer";
import ISignalingData from "./ISignalingData";

export enum ChannelType {
  RootChannel = 1,
  Contactlist = 2
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
  signalingData?: ISignalingData;
}
