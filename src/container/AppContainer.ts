import { Container } from "unstated";
import IOverlayNetwork from "./models/IOverlayNetwork";

export type AppState = {
  myId: string;
  name: string;
};

export default class AppContainer extends Container<AppState> {
  state = {
    myId: "",
    name: ""
  };

  constructor(private readonly overlayNetwork: IOverlayNetwork) {
    super();
  }

  bootstrap(address: string, name: string) {
    const id = this.overlayNetwork.bootstrap(address, name);
    this.setState({ myId: id, name });
  }
}
