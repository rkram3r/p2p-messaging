import Peer from "simple-peer";
import IChannel, { ContactStatus, ChannelType } from "./IChannel";
import IContact from "./IContact";
import { SignalingType } from "./ISignalingData";
import IExchange from "./IExchange";
import IOverlayNetwork from "./IOverlayNetwork";

export default class LinkedListOverlayNetwork implements IOverlayNetwork {
  private channelName: string = "p2p-connect";
  private io: SocketIOClientStatic;

  constructor(io: SocketIOClientStatic) {
    this.io = io;
  }

  private addMyselfToLinkedList(
    socket: SocketIOClient.Socket,
    addBuddies: (newContact: IContact) => void
  ) {
    const initiator = new Peer({ initiator: true });
    const listener = new Peer();

    socket.on(
      this.channelName,
      ({ signalingData, from: { id, name } }: IExchange) => {
        const peer =
          signalingData.type === SignalingType.Answer ? initiator : listener;

        peer.signal(signalingData);
        peer.on("connect", () => {
          if (signalingData.type) {
            const channels = new Map<ChannelType, IChannel>();
            channels.set(ChannelType.RootChannel, {
              peer,
              status: ContactStatus.Ready
            });

            addBuddies({ channels, id, name });
            signalingData.type === SignalingType.Offer && socket.close();
          }
        });
      }
    );

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
    from: IContact,
    addBuddies: (contact: IContact) => void
  ) {
    const socket = this.createSocket(address);
    const peers = this.addMyselfToLinkedList(socket, addBuddies);
    peers.forEach(peer =>
      peer.on("signal", signalingData =>
        socket.emit(this.channelName, { signalingData, from })
      )
    );
  }
}
