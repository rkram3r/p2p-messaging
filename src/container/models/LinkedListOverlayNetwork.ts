import Peer from "simple-peer";
import { SignalingType } from "./ISignalingData";
import IOverlayNetwork from "./IOverlayNetwork";
import Contact from "./Contact";
import TypedEvent from "./TypedEvent";
import { sha256 } from "js-sha256";
import IContact from "./IContact";
import IChannel, { ChannelType, ChannelState } from "./IChannel";

export default class LinkedListOverlayNetwork implements IOverlayNetwork {
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

  public bootstrap(address: string, name: string) {
    return new Promise<IChannel>((resolve, reject) => {
      const peerId = sha256(name);
      const socket = this.io(address, {
        transports: ["websocket"],
        secure: true
      });
      const peers = this.addMyselfToLinkedList(socket);
      this.rootChannel.once(() =>
        resolve({
          channelType: ChannelType.MySelf,
          name,
          peerId,
          state: ChannelState.Ready
        })
      );
      const from = { name, peerId };
      peers.forEach(peer => {
        peer.on("signal", data =>
          socket.emit(this.channelName, { data, from })
        );
        peer.on("error", error => {
          socket.close();
          reject(error);
        });
      });

      setTimeout(() => {
        reject("connection timeout");
        socket.close();
      }, this.connectionTimeOut);
    });
  }
}
