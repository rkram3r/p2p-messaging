import { Container } from "unstated";
import IOverlayNetwork from "./models/IOverlayNetwork";
import IMessage from "./models/IMessage";
import IChannel, { ChannelType } from "./models/IChannel";
import { sha256 } from "js-sha256";

type State = {
  message: string;
  channels: {
    [id: string]: IChannel;
  };
  messages: Array<IMessage>;
};

export default class MessageContainer extends Container<State> {
  state = {
    message: "",
    channels: {},
    messages: new Array<IMessage>()
  };

  constructor(private readonly overlayNetwork: IOverlayNetwork) {
    super();
    this.overlayNetwork.rootChannel.on(async contact => {
      const channel = await contact.createNewChannel(ChannelType.Messages);
      this.state.channels[contact.peerId] = channel;
      this.setState({ channels: this.state.channels });
      this.listenOnNewMessages(channel);
    });
  }

  private listenOnNewMessages(channel: IChannel) {
    channel.peer.on("data", newMessages => {
      const message = { ...JSON.parse(newMessages), from: channel.peerId };
      this.setState({ messages: [...this.state.messages, message] });
    });
  }

  send() {
    const timeStamp = new Date().getTime();
    const id = sha256(this.state.message + `${timeStamp}`);
    const newMessage = { id, message: this.state.message, timeStamp };
    Object.keys(this.state.channels).forEach(to => {
      const { peer } = this.state.channels[to];
      peer.send(JSON.stringify({ ...newMessage, to }));
    });
    this.setState({
      message: "",
      messages: [...this.state.messages, newMessage]
    });
  }

  onMessageChange(message: string) {
    this.setState({ message });
  }
}
