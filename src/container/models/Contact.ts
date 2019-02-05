import Peer from "simple-peer";
import IChannel, { ContactStatus, ChannelType } from "./IChannel";
import IContact, { IContactInformation } from "./IContact";
import PeerInstance from "./PeerInstance";

export default class Contact implements IContact {
  public channels: Map<ChannelType, IChannel>;
  public name: string;
  public id: string;
  public status: ContactStatus;

  constructor(
    from: IContactInformation,
    public rootPeer: Peer.Instance,
    channels: Array<ChannelType>,
    initiator: boolean
  ) {
    this.name = from.name;
    this.id = from.id;
    this.channels = this.createChannels(channels, initiator);
    this.initRoot();

    this.status = ContactStatus.Ready;
    Array.from(this.channels).forEach(([_, channel]) =>
      channel.peer.setup(this.rootPeer)
    );
  }

  private initRoot() {
    this.rootPeer.on("data", (data: string) => {
      const { signalingData, type } = JSON.parse(data);
      const entry = this.channels.get(type);
      entry.peer.signal(signalingData);
    });
    this.rootPeer.on("error", erro => console.log(erro));
  }

  private createChannels(channels: Array<ChannelType>, initiator: boolean) {
    return new Map<ChannelType, IChannel>(
      channels.map(type => {
        const peer = new PeerInstance({ initiator }, type);
        return [type, { peer, status: ContactStatus.NotConnected }] as [
          ChannelType,
          IChannel
        ];
      })
    );
  }
}
