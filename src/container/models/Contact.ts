import Peer from "simple-peer";
import IChannel, { ContactStatus, ChannelType } from "./IChannel";
import { IContactInformation } from "./IContact";
import PeerInstance from "./PeerInstance";

export default class Contact implements IContact {
  public channels: Map<ChannelType, IChannel>;
  public name: string;
  public id: string;
  public status: ContactStatus;

  constructor(
    from: IContactInformation,
    public rootPeer: Peer.Instance,
    channels: Map<ChannelType, (data: string) => void>,
    initiator: boolean
  ) {
    this.name = from.name;
    this.id = from.id;
    this.channels = this.createChannels(channels, initiator);
    this.initRoot();
  }

  private initRoot() {
    this.rootPeer.on("data", (data: string) => {
      const { signalingData, type } = JSON.parse(data);
      const entry = this.channels.get(type);
      entry.peer.signal(signalingData);
    });
    this.rootPeer.on("error", erro => console.log(erro));
  }

  private createChannels(
    channels: Map<ChannelType, (data: string) => void>,
    initiator: boolean
  ) {
    return new Map<ChannelType, IChannel>(
      Array.from(channels).map(([type, action]) => {
        const peer = new PeerInstance({ initiator }, type, action);
        return [type, { peer, status: ContactStatus.NotConnected }] as [
          ChannelType,
          IChannel
        ];
      })
    );
  }

  public setup() {
    this.status = ContactStatus.Ready;
    Array.from(this.channels).forEach(([_, channel]) =>
      channel.peer.setup(this.rootPeer)
    );
  }
}
