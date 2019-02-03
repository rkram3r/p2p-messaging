import * as React from "react";

interface IStatus {
  goToNextState?: () => void;
  name: string;
}

export default (props: { status: IStatus; children: React.ReactNode }) => {
  const {
    status: { name },
    children
  } = props;
  return (
    <button
      onClick={() => props.status.goToNextState()}
      type="button"
      className="list-group-item-action list-group-item"
    >
      {children}
      {name}
    </button>
  );
};
