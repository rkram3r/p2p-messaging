import IChannel, { ChannelType } from "./IChannel";

export default interface IContact extends IChannel {
  createNewChannel(type: ChannelType): Promise<IChannel>;
}
