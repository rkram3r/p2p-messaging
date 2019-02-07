import { Container } from "unstated";
import IOverlayNetwork from "./models/IOverlayNetwork";
import Channels from "./models/Channels";
import IMessage from "./models/IMessage";
import { ChannelType } from "./models/IChannel";
import { sha256 } from "js-sha256";

type State = {
  message: string;
  channels: Channels;
  messages: Array<IMessage>;
};

export default class MessageContainer extends Container<State> {
  state = {
    message: "",
    channels: new Channels(),
    messages: new Array<IMessage>()
  };

  constructor(private readonly overlayNetwork: IOverlayNetwork) {
    super();
    this.overlayNetwork.channels.on(channel => {
      if (!this.state.channels[channel.peerId]) {
        this.state.channels[channel.peerId] = {};
      }
      this.state.channels[channel.peerId][channel.channelType] = channel;
      this.setState({ channels: this.state.channels });
    });

    this.overlayNetwork.channels.on(channel => {
      if (channel.channelType === ChannelType.Messages) {
        channel.peer.on("data", newMessages => {
          const message = { ...JSON.parse(newMessages), from: channel.peerId };
          this.setState({
            messages: [...this.state.messages, message]
          });
        });
      }
    });
    this.overlayNetwork.rootChannel.on(contact => {
      this.overlayNetwork.createNewChannel(contact, ChannelType.Messages);
    });
  }

  send(message: string) {
    const timeStamp = new Date().getTime();
    const id = sha256(message + `${timeStamp}`);
    const newMessage = { id, message, timeStamp };
    Object.keys(this.state.channels).forEach(to => {
      const { peer } = this.state.channels[to][ChannelType.Messages];
      peer.send(JSON.stringify({ newMessage }));
    });
  }

  onMessageChange(message: string) {
    this.setState({ message });
  }
  cleanInput() {
    this.setState({ message: "" });
  }
}
