import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as Actions from '../redux/actions';

export default connect(
  state => ({ ...state.p2pReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(withRouter(({
  message, onMessageChange, send, contactlist,
  match: { params: { sendTo } },
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
        <button
          type="submit"
          className="float-right btn-block btn btn-primary"
          onClick={() => {
            send({ contactlist, sendTo }, message);
          }}
        >
Send
        </button>
      </div>
    </div>
  </div>
)));
