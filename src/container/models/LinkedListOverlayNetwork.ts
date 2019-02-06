import Peer from "simple-peer";
import IChannel, { ChannelType } from "./IChannel";
import ISignalingData, { SignalingType } from "./ISignalingData";
import IOverlayNetwork from "./IOverlayNetwork";
import Contact from "./Contact";
import TypedEvent from "./TypedEvent";
import { sha256 } from "js-sha256";
import IContact from "./IContact";
import IContactInformation from "./IContactInformation";

type Exchange = {
  from: IContactInformation;
  data: ISignalingData;
};

export default class LinkedListOverlayNetwork implements IOverlayNetwork {
  public readonly channels = new TypedEvent<IChannel>();
  public readonly rootChannel = new TypedEvent<IContact>();

  private readonly channelName: string = "p2p-connect";
  private io: SocketIOClientStatic;

  constructor(io: SocketIOClientStatic) {
    this.io = io;
  }

  private isInitiator(type: SignalingType) {
    return type === SignalingType.Answer;
  }

  public async createNewChannel(contact: Contact, type: ChannelType) {
    const channel = await contact.createNewChannel(type);
    this.channels.emit(channel);
  }

  private addMyselfToLinkedList(socket: SocketIOClient.Socket) {
    const initiator = new Peer({ initiator: true });
    const listener = new Peer();

    socket.on(this.channelName, ({ data, from }: Exchange) => {
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
    const peerId = sha256(name);
    const socket = this.io(address, {
      transports: ["websocket"],
      secure: true
    });
    const peers = this.addMyselfToLinkedList(socket);
    const from: IContactInformation = { name, peerId };
    peers.forEach(peer =>
      peer.on("signal", data => socket.emit(this.channelName, { data, from }))
    );

    return peerId;
  }
}
