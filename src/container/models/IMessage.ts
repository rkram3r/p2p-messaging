export default interface IMessage {
  from: string;
  to: string;
  id: string;
  groupName?: string;
  message: string;
  timeStamp: number;
}
