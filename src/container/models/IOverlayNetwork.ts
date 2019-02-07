import TypedEvent from "./TypedEvent";
import { IContact } from "./Contact";
import IChannel from "./IChannel";

export default interface IOverlayNetwork {
  bootstrap(address: string, name: string): Promise<IChannel>;
  rootChannel: TypedEvent<IContact>;
}
