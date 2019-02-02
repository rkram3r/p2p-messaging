import { names } from "../constants";

const defaultName = names[Math.floor(Math.random() * names.length)];

export default (
  oldState = {
    connection: `${defaultName}@localhost:3030`,
    myName: defaultName,
    address: "localhost:3030"
  },
  action
) => {
  const { type, ...rest } = action;
  if (type === "CREATE_SOCKET" || type === "CREATE_PEERS") {
    return { ...oldState, ...rest };
  }

  if (type === "CONNECTION_CHANGE") {
    const { connection } = rest;
    const [myName, address] = connection.split("@");
    return {
      ...oldState,
      myName,
      address,
      connection
    };
  }
  return oldState;
};
