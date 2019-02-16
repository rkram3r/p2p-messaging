import { Container } from "unstated";
import IOverlayNetwork from "./models/IOverlayNetwork";
import IChannel, { ChannelType } from "./models/IChannel";

type Message = {
  from?: number;
  to?: string;
  message: string;
  timeStamp: number;
};

type State = {
  message: string;
  channels: {
    [peerId: number]: IChannel;
  };
  messages: Array<Message>;
  autoFocus: boolean;
};

export default class MessageContainer extends Container<State> {
  state = {
    message: "",
    channels: {},
    messages: new Array<Message>(),
    autoFocus: false
  };

  constructor(private readonly overlayNetwork: IOverlayNetwork) {
    super();
    this.overlayNetwork.contacts.on(async contact => {
      const channel = await contact.createNewChannel(ChannelType.Messages);
      this.state.channels[contact.peerId] = channel;
      this.setState({ channels: this.state.channels });
      this.listenOnNewMessages(channel);
    });
    overlayNetwork.networkState.once(() => {
      this.setState({ autoFocus: true });
    });
  }

  private listenOnNewMessages(channel: IChannel) {
    channel.peer.on("data", newMessages => {
      const message = { ...JSON.parse(newMessages), from: channel.peerId };
      this.setState({ messages: [...this.state.messages, message] });
    });
  }

  send() {
    if (this.state.message.length !== 0) {
      const timeStamp = new Date().getTime();
      const newMessage = { message: this.state.message, timeStamp };
      Object.keys(this.state.channels).forEach(to => {
        const { peer } = this.state.channels[to];
        peer.send(JSON.stringify({ ...newMessage, to }));
      });
      this.setState({
        message: "",
        messages: [...this.state.messages, newMessage]
      });
    }
  }

  onMessageChange(message: string) {
    this.setState({ message });
  }
}
