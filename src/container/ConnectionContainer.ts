import { Container } from "unstated";

type State = {
  address: string;
  myName: string;
  connection: string;
};

export class ConnectionContainer extends Container<State> {
  state = {
    address: "",
    myName: "",
    connection: ""
  };
  constructor() {
    super();
    const myName = names[Math.floor(Math.random() * names.length)];
    const address = "localhost:3030";
    const connection = `${myName}@${address}`;
    this.setState({ connection, myName, address });
  }
  connectionChange(connection: string) {
    const [myName, address] = connection.split("@");
    this.setState({ address, myName, connection });
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
