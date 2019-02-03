import { Container } from "unstated";

interface IMessageContainer {
  message: string;
}

export default class MessageContainer extends Container<IMessageContainer> {
  state = { message: "" };

  onMessageChange(message: string) {
    this.setState({ message });
  }
  cleanInput() {
    this.setState({ message: "" });
  }
}
