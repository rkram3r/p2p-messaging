import IContact from "./IContact";
import IChannel, { ChannelType } from "./IChannel";
import Peer from "simple-peer";

export default interface IOverlayNetwork {
  bootstrap(
    address: string,
    from: IContact,
    registerToChannels: Array<ChannelType>,
    addBuddies: (contact: IContact) => void
  ): void;
  setupChannels(
    rootPeer: Peer.Instance,
    channels: Map<ChannelType, IChannel>
  ): void;
  setupRootChannel(
    peer: Peer.Instance,
    channels: Map<ChannelType, IChannel>
  ): void;
}
