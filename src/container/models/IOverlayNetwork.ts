import TypedEvent from "./TypedEvent";
import { IContact } from "./Contact";
import { ChannelState } from "./IChannel";

export interface IConnectionState {
  peerId: string;
  name: string;
  state: ChannelState;
}

export default interface IOverlayNetwork {
  bootstrap(address: string, name: string): void;
  rootChannel: TypedEvent<IContact>;
  overlayNetworkState: TypedEvent<IConnectionState | Error>;
}
