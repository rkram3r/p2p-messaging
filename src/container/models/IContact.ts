import IChannel, { ChannelType } from "./IChannel";
import IContactInformation from "./IContactInformation";

export default interface IContact extends IContactInformation {
  createNewChannel(type: ChannelType): Promise<IChannel>;
}
