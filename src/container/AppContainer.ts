import { Container } from "unstated";
import IOverlayNetwork, { IConnectionState } from "./models/IOverlayNetwork";
import { ChannelState } from "./models/IChannel";

export default class AppContainer extends Container<IConnectionState> {
  state = {
    peerId: "",
    name: "",
    state: ChannelState.NotConnected
  };

  constructor(private readonly overlayNetwork: IOverlayNetwork) {
    super();
  }

  async bootstrap(address: string, name: string) {
    this.overlayNetwork.bootstrap(address, name);
    this.overlayNetwork.overlayNetworkState.on(state => {
      if (state instanceof Error) {
        console.error(state);
        this.setState({ state: ChannelState.Error });
      } else {
        this.setState(state);
      }
    });
  }
}
