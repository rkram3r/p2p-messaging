export default interface IMessage {
  from?: string;
  to?: string;
  id: string;
  message: string;
  timeStamp: number;
}
