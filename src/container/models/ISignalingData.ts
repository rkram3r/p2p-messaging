export enum SignalingType {
  Answer = "answer",
  Offer = "offer"
}
export default interface ISignalingData {
  sdp: string;
  type: SignalingType;
}
