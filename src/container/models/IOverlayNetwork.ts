import TypedEvent from "./TypedEvent";
import { ChannelState, IContact } from "./IChannel";

export default interface IOverlayNetwork {
  bootstrap(address: string, name: string): void;
  rootChannel: TypedEvent<IContact>;
  networkState: TypedEvent<ChannelState>;
  peerId: string;
  name: string;
}
