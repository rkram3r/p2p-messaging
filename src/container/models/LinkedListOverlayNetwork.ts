import Peer from "simple-peer";
import IChannel, { ContactStatus, ChannelType } from "./IChannel";
import IContact from "./IContact";
import { SignalingType } from "./ISignalingData";
import IExchange from "./IExchange";
import IOverlayNetwork from "./IOverlayNetwork";
import io from "socket.io-client";

export default class LinkedListOverlayNetwork implements IOverlayNetwork {
  private channelName: string = "p2p-connect";
  private io: io.SocketIOClientStatic;

  constructor(io: io.SocketIOClientStatic) {
    this.io = io;
  }

  private isInitiator(type: SignalingType) {
    return type === SignalingType.Answer;
  }

  private createChannels(
    channelTypes: Array<ChannelType>,
    signalType: SignalingType
  ) {
    return new Map<ChannelType, IChannel>(
      channelTypes.map(
        type =>
          [
            type,
            {
              peer: new Peer({
                initiator: this.isInitiator(signalType)
              }),
              status: ContactStatus.NotConnected
            }
          ] as [ChannelType, IChannel]
      )
    );
  }

  private addMyselfToLinkedList(
    socket: io.SocketIOClient.Socket,
    channelTypes: Array<ChannelType>,
    addBuddies: (newContact: IContact) => void
  ) {
    const initiator = new Peer({ initiator: true });
    const listener = new Peer();

    socket.on(
      this.channelName,
      ({ signalingData, from: { id, name } }: IExchange) => {
        const peer = this.isInitiator(signalingData.type)
          ? initiator
          : listener;

        peer.signal(signalingData);
        peer.on("connect", () => {
          if (signalingData.type) {
            const channels = this.createChannels(
              channelTypes,
              signalingData.type
            );
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
    registerToChannels: Array<ChannelType>,
    addBuddies: (contact: IContact) => void
  ) {
    const socket = this.createSocket(address);
    const peers = this.addMyselfToLinkedList(
      socket,
      registerToChannels,
      addBuddies
    );
    peers.forEach(peer =>
      peer.on("signal", signalingData =>
        socket.emit(this.channelName, { signalingData, from })
      )
    );
  }

  public setupRootChannel(
    peer: Peer.Instance,
    channels: Map<ChannelType, IChannel>
  ) {
    peer.on("data", (data: string) => {
      const { signalingData, type } = JSON.parse(data);
      console.log(type, channels);
      const entry = channels.get(type);
      entry.peer.signal(signalingData);
    });
  }

  public setupChannels(
    rootPeer: Peer.Instance,
    channels: Map<ChannelType, IChannel>
  ) {
    Array.from(channels).map(([type, channel]) => {
      channel.peer.on("signal", signalingData => {
        rootPeer.send(JSON.stringify({ signalingData, type }));
      });
      channel.peer.on("connect", () => console.log("connect!", type));
    });
  }
}
