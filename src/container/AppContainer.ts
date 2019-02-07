import { Container } from "unstated";
import IOverlayNetwork from "./models/IOverlayNetwork";
import IContactInformation from "./models/IContactInformation";

export default class AppContainer extends Container<IContactInformation> {
  state = {
    peerId: "",
    name: ""
  };

  constructor(private readonly overlayNetwork: IOverlayNetwork) {
    super();
  }

  async bootstrap(address: string, name: string) {
    try {
      const contactInformation = await this.overlayNetwork.bootstrap(
        address,
        name
      );
      this.setState(contactInformation);
    } catch (error) {
      console.log(error);
    }
  }
}
