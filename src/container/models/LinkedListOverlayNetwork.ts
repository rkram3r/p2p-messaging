import Peer from "simple-peer";
import { SignalingType } from "./ISignalingData";
import IOverlayNetwork from "./IOverlayNetwork";
import Contact from "./Contact";
import TypedEvent from "./TypedEvent";
import { ChannelState, IContact, ChannelType } from "./IChannel";

export default class LinkedListOverlayNetwork implements IOverlayNetwork {
  public peerId: number = 0;
  public name: string;
  public readonly networkState = new TypedEvent<ChannelState>();
  public readonly contacts = new TypedEvent<IContact>();
  private readonly channelName: string = "p2p-connect";
  private leftNode: IContact;
  private rightNode: IContact;

  constructor(
    private readonly io: SocketIOClientStatic,
    private readonly connectionTimeOut: number
  ) {}

  private isInitiator(type: SignalingType) {
    return type === SignalingType.Offer;
  }

  private addMyselfToLinkedList(socket: SocketIOClient.Socket) {
    const listener = new Peer({ initiator: true });
    const initiator = new Peer();
    socket.on(this.channelName, ({ data, name }) => {
      const peer = this.isInitiator(data.type) ? initiator : listener;
      peer.signal(data);
      peer.on("connect", async () => {
        if (data.type) {
          const contact = new Contact(name, peer, this.isInitiator(data.type));
          const channel = await contact.createNewChannel(
            ChannelType.RootChannel
          );
          if (this.isInitiator(data.type)) {
            this.rightNode = contact;
            this.rightNode.peerId = this.peerId + 1;
            channel.peer.send(JSON.stringify(this.peerId));
            this.contacts.emit(this.rightNode);
          } else {
            this.leftNode = contact;

            channel.peer.on("data", data => {
              const x = JSON.parse(data);
              this.peerId = x + 1;
              console.log("leftnode", x);
              this.leftNode.peerId = x;
              this.contacts.emit(this.leftNode);

              console.log(
                `left: ${this.leftNode && this.leftNode.peerId} me: ${
                  this.peerId
                } right:${this.rightNode && this.rightNode.peerId}`
              );
            });
          }

          console.log(
            `left: ${this.leftNode && this.leftNode.peerId} me: ${
              this.peerId
            } right:${this.rightNode && this.rightNode.peerId}`
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
    peers.forEach(peer => {
      peer.on("signal", data =>
        socket.emit(this.channelName, { data, name: this.name })
      );
      peer.on("error", error => {
        socket.close();
        console.error(error);
        this.networkState.emit(ChannelState.Error);
      });
    });

    return socket;
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
    this.name = name;
    const socket = this.signalingPeersOverSocket(address);
    const timeout = this.closeSocketAfter(socket, this.connectionTimeOut);
    this.contacts.once(() => {
      clearTimeout(timeout);
      this.networkState.emit(ChannelState.Ready);
    });
  }
}
