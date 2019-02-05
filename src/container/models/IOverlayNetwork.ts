import { IContactInformation } from "./IContact";
import { ChannelType } from "./IChannel";
import TypedEvent from "./TypedEvent";

export default interface IOverlayNetwork<T> {
  bootstrap(
    address: string,
    from: IContactInformation,
    registerToChannels: Array<ChannelType>
  ): TypedEvent<T>;
}
