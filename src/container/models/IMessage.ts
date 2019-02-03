export default interface IMessage {
  from: string;
  id: string;
  groupName?: string;
  message: string;
  timeStamp: number;
}
