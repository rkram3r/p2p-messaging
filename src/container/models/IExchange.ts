import IContact from "./IContact";
import ISignalingData from "./ISignalingData";

export default interface IExchange {
  from: IContact;
  signalingData: ISignalingData;
}
