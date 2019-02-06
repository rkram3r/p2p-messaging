import TypedEvent from "./TypedEvent";
import IChannel, { ChannelType } from "./IChannel";
import IContact from "./IContact";

export default interface IOverlayNetwork {
  bootstrap(address: string, name: string): string;
  createNewChannel(contact: IContact, type: ChannelType): void;
  channels: TypedEvent<IChannel>;
  rootChannel: TypedEvent<IContact>;
}
