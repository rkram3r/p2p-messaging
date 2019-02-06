import { ChannelState } from "./IChannel";

export default interface IContactInformation {
  name: string;
  peerId: string;
  state?: ChannelState;
}
