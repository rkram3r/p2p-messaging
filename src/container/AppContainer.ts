import { Container } from "unstated";
import IOverlayNetwork from "./models/IOverlayNetwork";
import { ChannelState } from "./models/IChannel";

type AppState = {
  peerId: string;
  name: string;
  state: ChannelState;
};

export default class AppContainer extends Container<AppState> {
  state = {
    peerId: "",
    name: "",
    state: ChannelState.NotConnected
  };

  constructor(overlayNetwork: IOverlayNetwork) {
    super();
    overlayNetwork.networkState.on(state => this.setState({ state }));
  }
}
