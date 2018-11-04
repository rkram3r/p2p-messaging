import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';
import Messages from './Messages';

class Contactlist extends React.Component {
  componentDidUpdate(prevProps) {
    const { broadcastContactlist, contactlist } = this.props;

    if (prevProps.contactlist.size !== contactlist.size) {
      broadcastContactlist(contactlist);
    }
  }

  render() {
    const { contactlist } = this.props;
    return (
      <div className="my-3 p-3 bg-white rounded shadow-sm">
        <div className="row">
          <div className="my-3 p-3 bg-white rounded shadow-sm col-sm-4">
            <h5>Contactlist</h5>
            <div className="list-group">
              {Array.from(contactlist).map(([id, { name, peer }]) => (
                <a
                  key={id}
                  className="list-group-item-action list-group-item"
                  href={`#sendTo${name}`}
                >
                  {name}
                  {peer && 'can send..'}
                </a>
              ))}
            </div>
          </div>
          <Messages />
        </div>
      </div>
    );
  }
}
export default connect(
  state => ({ ...state.p2pReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(Contactlist);
