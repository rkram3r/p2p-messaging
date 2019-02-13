import Peer from "simple-peer";
import { SignalingType } from "./ISignalingData";
import IOverlayNetwork from "./IOverlayNetwork";
import Contact from "./Contact";
import TypedEvent from "./TypedEvent";
import { sha256 } from "js-sha256";
import { IContact } from "./Contact";
import { ChannelState } from "./IChannel";

export default class LinkedListOverlayNetwork implements IOverlayNetwork {
  public peerId: string;
  public name: string;
  public readonly networkState = new TypedEvent<ChannelState>();
  public readonly rootChannel = new TypedEvent<IContact>();
  private readonly channelName: string = "p2p-connect";

  constructor(
    private readonly io: SocketIOClientStatic,
    private readonly connectionTimeOut: number
  ) {}

  private isInitiator(type: SignalingType) {
    return type === SignalingType.Answer;
  }

  private addMyselfToLinkedList(socket: SocketIOClient.Socket) {
    const initiator = new Peer({ initiator: true });
    const listener = new Peer();
    socket.on(this.channelName, ({ data, from }) => {
      const peer = this.isInitiator(data.type) ? initiator : listener;
      peer.signal(data);
      peer.on("connect", () => {
        if (this.peerId === from.peerId) {
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

  private signalingPeersOverSocket(address: string) {
    const socket = this.io(address, {
      transports: ["websocket"],
      secure: true
    });
    const peers = this.addMyselfToLinkedList(socket);
    const from = { name: this.name, peerId: this.peerId };
    peers.forEach(peer => {
      peer.on("signal", data => socket.emit(this.channelName, { data, from }));
      peer.on("error", error => {
        socket.close();
        console.error(error);
        this.networkState.emit(ChannelState.Error);
      });
    });

    return socket;
  }

  private setContactInfos(name: string) {
    const peerId = sha256(name + new Date().getTime());
    this.peerId = peerId;
    this.name = name;
  }

  private closeSocketAfter(
    socket: SocketIOClient.Socket,
    connectionTimeOut: number
  ) {
    return setTimeout(() => {
      console.error("connection timeout.");
      this.networkState.emit(ChannelState.Error);
      socket.close();
    }, connectionTimeOut);
  }

  public bootstrap(address: string, name: string) {
    this.setContactInfos(name);
    const socket = this.signalingPeersOverSocket(address);
    const timeout = this.closeSocketAfter(socket, this.connectionTimeOut);
    this.rootChannel.once(() => {
      clearTimeout(timeout);
      this.networkState.emit(ChannelState.Ready);
    });
  }
}
