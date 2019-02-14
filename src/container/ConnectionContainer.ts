import { Container } from "unstated";
import IOverlayNetwork from "./models/IOverlayNetwork";
import { ChannelState } from "./models/IChannel";

type State = {
  address: string;
  connection: string;
  autoFocus: boolean;
  peerId: string;
  name: string;
  state: ChannelState;
};

export default class ConnectionContainer extends Container<State> {
  state = {
    address: "",
    peerId: "",
    name: "",
    state: ChannelState.NotConnected,
    connection: "",
    autoFocus: true
  };
  constructor(private readonly overlayNetwork: IOverlayNetwork) {
    super();
    const name = names[Math.floor(Math.random() * names.length)];
    const address = "localhost:3030";
    const connection = `${name}@${address}`;
    this.setState({ connection, name, address });

    overlayNetwork.networkState.once(() => {
      this.setState({ autoFocus: false });
    });
    overlayNetwork.networkState.on(state => {
      if (state === ChannelState.Ready) {
        this.setState({
          state,
          name: overlayNetwork.name,
          peerId: overlayNetwork.peerId
        });
      } else {
        this.setState({ state });
      }
    });
  }

  connectionChange(connection: string) {
    const [name, address] = connection.split("@");
    this.setState({ address, name, connection });
  }

  bootstrap() {
    this.overlayNetwork.bootstrap(this.state.address, this.state.name);
  }
}

const names = [
  "James Bond",
  "Indiana Jones",
  "Donnie Darko",
  "Gordon Gekko",
  "Verbal Kint",
  "Crocodile Dundee",
  "John Rambo",
  "Vincent Vega",
  "Snake Plissken",
  "Luke Skywalker",
  "Han Solo",
  "Jack Sparrow",
  "Freddy Krueger",
  "Forrest Gump",
  "Peter Venkman",
  "Vito Corleone",
  "Norman Bates",
  "Rhett Butler",
  "Ace Ventura",
  "Hannibal Lecter",
  "Stacker Pentecost",
  "Buckaroo Banzai",
  "Optimus Prime",
  "Tony Montana",
  "Axel Foley",
  "Atticus Finch",
  "Marty McFly"
];
