import IContact from "./IContact";
export default interface IOverlayNetwork {
  bootstrap(
    address: string,
    from: IContact,
    addBuddies: (contact: IContact) => void
  ): void;
}
