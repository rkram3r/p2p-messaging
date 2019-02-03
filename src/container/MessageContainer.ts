import { Container } from "unstated";

type State = {
  message: string;
};

export default class MessageContainer extends Container<State> {
  state = { message: "" };

  onMessageChange(message: string) {
    this.setState({ message });
  }
  cleanInput() {
    this.setState({ message: "" });
  }
}
