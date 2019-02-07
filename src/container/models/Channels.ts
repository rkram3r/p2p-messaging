import IChannel from "./IChannel";

export default class Channels {
  [id: string]: {
    [type: number]: IChannel;
  };
}
