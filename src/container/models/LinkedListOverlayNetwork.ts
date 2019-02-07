import Peer from "simple-peer";
import { SignalingType } from "./ISignalingData";
import IOverlayNetwork, { IConnectionState } from "./IOverlayNetwork";
import Contact from "./Contact";
import TypedEvent from "./TypedEvent";
import { sha256 } from "js-sha256";
import { IContact } from "./Contact";
import { ChannelState } from "./IChannel";

export default class LinkedListOverlayNetwork implements IOverlayNetwork {
  public readonly overlayNetworkState = new TypedEvent<
    IConnectionState | Error
  >();
  public readonly rootChannel = new TypedEvent<IContact>();

  constructor(
    private readonly io: SocketIOClientStatic,
    private readonly connectionTimeOut: number,
    private readonly channelName: string = "p2p-connect"
  ) {}

  private isInitiator(type: SignalingType) {
    return type === SignalingType.Answer;
  }

  private addMyselfToLinkedList(socket: SocketIOClient.Socket, myself: string) {
    const initiator = new Peer({ initiator: true });
    const listener = new Peer();
    socket.on(this.channelName, ({ data, from }) => {
      const peer = this.isInitiator(data.type) ? initiator : listener;
      peer.signal(data);
      peer.on("connect", () => {
        if (myself === from.peerId) {
          socket.close();
          throw new Error("cannot bootstrap twice!");
        }
        if (data.type) {
          this.rootChannel.emit(
            new Contact(
              from.name,
              from.peerId,
              peer,
              this.isInitiator(data.type)
            )
          );
          data.type === SignalingType.Offer && socket.close();
        }
      });
    });

    return [initiator, listener];
  }

  private signalingPeersOverSocket(
    address: string,
    { peerId, name }: { peerId: string; name: string }
  ) {
    const socket = this.io(address, {
      transports: ["websocket"],
      secure: true
    });
    const peers = this.addMyselfToLinkedList(socket, peerId);

    peers.forEach(peer => {
      peer.on("signal", data =>
        socket.emit(this.channelName, { data, from: { name, peerId } })
      );
      peer.on("error", error => {
        socket.close();
        this.overlayNetworkState.emit(error);
      });
    });

    return socket;
  }

  public bootstrap(address: string, name: string) {
    const timeout = setTimeout(() => {
      console.log("close socket.");
      this.overlayNetworkState.emit(new Error("connection timeout"));
      socket.close();
    }, this.connectionTimeOut);

    const peerId = sha256(name);
    const socket = this.signalingPeersOverSocket(address, { peerId, name });
    this.rootChannel.once(() => {
      this.overlayNetworkState.emit({
        name,
        peerId,
        state: ChannelState.Ready
      });
      clearTimeout(timeout);
    });
  }
}
