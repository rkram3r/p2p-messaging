import Peer from "simple-peer";
import IChannel, { ChannelType } from "./IChannel";
import TypedEvent from "./TypedEvent";
import ISignalingData from "./ISignalingData";

type SignalExchange = {
  signalingData: ISignalingData;
  channelType: ChannelType;
};

export interface IContact extends IChannel {
  createNewChannel(type: ChannelType): Promise<IChannel>;
}

export default class Contact implements IContact {
  private readonly channelEvent = new TypedEvent<SignalExchange>();

  constructor(
    public readonly name: string,
    public readonly peerId: string,
    public readonly peer: Peer.Instance,
    private readonly isInitiator: boolean
  ) {
    this.peer.on("data", (data: string) =>
      this.channelEvent.emit(JSON.parse(data))
    );
  }

  public createNewChannel(type: ChannelType) {
    return new Promise<IChannel>((resolve, reject) => {
      const peer = new Peer({ initiator: this.isInitiator });
      peer.on("signal", signalingData =>
        this.peer.send(JSON.stringify({ signalingData, channelType: type }))
      );
      this.channelEvent.on(
        ({ signalingData, channelType }) =>
          type === channelType && peer.signal(signalingData)
      );
      peer.on("connect", () =>
        resolve({
          peer,
          peerId: this.peerId,
          name: this.name
        })
      );
      peer.on("error", error => reject(error));
    });
  }
}
