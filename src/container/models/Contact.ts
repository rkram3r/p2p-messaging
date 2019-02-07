import Peer from "simple-peer";
import IChannel, { ChannelState, ChannelType } from "./IChannel";
import TypedEvent from "./TypedEvent";
import ISignalingData from "./ISignalingData";
import IContact from "./IContact";

type SignalExchange = {
  signalingData: ISignalingData;
  channelType: ChannelType;
};

export default class Contact implements IContact {
  public readonly channelType = ChannelType.RootChannel;
  public readonly state = ChannelState.Ready;
  private readonly channelEvent = new TypedEvent<SignalExchange>();

  constructor(
    public readonly name: string,
    public readonly peerId: string,
    public readonly peer: Peer.Instance,
    public readonly isInitiator: boolean
  ) {
    this.peer.on("data", (data: string) => {
      this.channelEvent.emit(JSON.parse(data));
    });
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
          state: ChannelState.Ready,
          peerId: this.peerId,
          name: this.name,
          channelType: type
        })
      );
      peer.on("error", () =>
        reject({ peer, state: ChannelState.Error, channeltype: type })
      );
    });
  }
}
