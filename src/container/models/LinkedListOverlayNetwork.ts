import Peer from "simple-peer";
import { ChannelType } from "./IChannel";
import IContact, { IContactInformation } from "./IContact";
import { SignalingType } from "./ISignalingData";
import IExchange from "./IExchange";
import IOverlayNetwork from "./IOverlayNetwork";
import Contact from "./Contact";
import TypedEvent from "./TypedEvent";

export default class LinkedListOverlayNetwork
  implements IOverlayNetwork<IContact> {
  private channelName: string = "p2p-connect";
  private io: SocketIOClientStatic;

  constructor(io: SocketIOClientStatic) {
    this.io = io;
  }

  private isInitiator(type: SignalingType) {
    return type === SignalingType.Answer;
  }

  private addMyselfToLinkedList(
    socket: SocketIOClient.Socket,
    channelTypes: Map<ChannelType, (data: string) => void>,
    eventEmitter: TypedEvent<IContact>
  ) {
    const initiator = new Peer({ initiator: true });
    const listener = new Peer();

    socket.on(this.channelName, ({ signalingData, from }: IExchange) => {
      const peer = this.isInitiator(signalingData.type) ? initiator : listener;
      peer.signal(signalingData);
      peer.on("connect", () => {
        if (signalingData.type) {
          eventEmitter.emit(
            new Contact(
              from,
              peer,
              channelTypes,
              this.isInitiator(signalingData.type)
            )
          );
          signalingData.type === SignalingType.Offer && socket.close();
        }
      });
    });

    return [initiator, listener];
  }

  private createSocket(address: string) {
    return this.io(address, {
      transports: ["websocket"],
      secure: true
    });
  }

  public bootstrap(
    address: string,
    from: IContactInformation,
    registerToChannels: Map<ChannelType, (data: string) => void>
  ) {
    const eventEmitter = new TypedEvent<IContact>();
    const socket = this.createSocket(address);
    const peers = this.addMyselfToLinkedList(
      socket,
      registerToChannels,
      eventEmitter
    );
    peers.forEach(peer =>
      peer.on("signal", signalingData =>
        socket.emit(this.channelName, { signalingData, from })
      )
    );

    return eventEmitter;
  }
}
