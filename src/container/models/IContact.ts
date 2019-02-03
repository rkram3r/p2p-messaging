import IChannel, { ChannelType } from "./IChannel";

export default interface IContact {
  name: string;
  id: string;
  channels?: Map<ChannelType, IChannel>;
}
