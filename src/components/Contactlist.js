import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import WifiOff from 'react-feather/dist/icons/wifi-off';
import WifiOn from 'react-feather/dist/icons/wifi';

import * as Actions from '../redux/actions';
import Messages from './Messages';
import './Contactlist.scss';

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
                <button
                  key={id}
                  type="button"
                  className="list-group-item-action list-group-item"
                >
                  {peer ? <WifiOn className="glyphicon" /> : <WifiOff className="glyphicon" />}
                  {name}
                </button>
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
