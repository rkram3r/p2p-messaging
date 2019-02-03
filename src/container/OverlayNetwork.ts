import io from "socket.io-client";
import Peer from "simple-peer";
import IChannel, { ContactStatus, ChannelType } from "./models/IChannel";
import IContact from "./models/IContact";
import { SignalingType } from "./models/ISignalingData";
import IExchange from "./models/IExchange";

const channelName = "p2p-connect";

const setupSocket = (
  socket: any,
  eventAddContact: (newContact: IContact) => void
) => {
  const initiator = new Peer({ initiator: true });
  const listener = new Peer();

  socket.on(channelName, ({ signalingData, from: { id, name } }: IExchange) => {
    const peer =
      signalingData.type === SignalingType.Answer ? initiator : listener;

    peer.signal(signalingData);
    peer.on("connect", () => {
      if (signalingData.type) {
        const channels = new Map<ChannelType, IChannel>();
        channels.set(ChannelType.RootChannel, {
          peer,
          status: ContactStatus.Ready
        });

        eventAddContact({ channels, id, name });
        signalingData.type === SignalingType.Offer && socket.close();
      }
    });
  });

  return [initiator, listener];
};

export const bootstrap = (
  address: string,
  mySelf: IContact,
  eventAddContact: (newContact: IContact) => void
) => {
  const socket = io(address, {
    transports: ["websocket"],
    secure: true
  });

  const [initiator, listener] = setupSocket(socket, eventAddContact);

  initiator.on("signal", signalingData =>
    socket.emit(channelName, { signalingData, from: mySelf })
  );

  listener.on("signal", signalingData =>
    socket.emit(channelName, { signalingData, from: mySelf })
  );
};
