import TypedEvent from "./TypedEvent";
import IContact from "./IContact";
import IContactInformation from "./IContactInformation";

export default interface IOverlayNetwork {
  bootstrap(address: string, name: string): Promise<IContactInformation>;
  rootChannel: TypedEvent<IContact>;
}
