import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';

const createMessage = ({
  message, onMessageChange, sendMessage, peers,
}) => (
  <div className="my-3 p-3 bg-white rounded shadow-sm">
    <div className="form-group row">
      <div className="col-sm-8">
        <input
          type="text"
          className="form-control"
          placeholder="Message"
          value={message}
          onChange={({ target: { value } }) => onMessageChange(value)}
        />
      </div>
      <div className="col-sm-4 float-right">
        <button type="submit" className="float-right btn-block btn btn-primary" onClick={() => sendMessage(peers, message)}>Send</button>
      </div>
    </div>
  </div>
);

export default connect(
  state => ({ ...state.p2pReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(createMessage);
