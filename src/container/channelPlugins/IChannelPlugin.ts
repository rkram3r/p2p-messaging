import { IContactInformation } from "../models/IContact";
import IChannel from "../models/IChannel";

export default interface IChannelPlugin<TState> {
  onData(data: string, state: TState): TState;
  send(reciever: IContactInformation, channel: IChannel, state: TState): TState;
}
