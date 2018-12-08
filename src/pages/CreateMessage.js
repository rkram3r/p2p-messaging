import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as Actions from '../logic/actions';

export default withRouter(connect(
  state => ({ ...state.p2pReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(({
  message, onMessageChange, send, contactlist, id,
  verifyChange, verifyMessage,
  match: { params: { sendTo } },
}) => (

  <div className="form-group row shadow-sm py-3">
    <div className="col-sm-8 col-lg-10">
      <input
        className="form-control"
        placeholder="Message"
        value={message}
        onChange={({ target: { value } }) => onMessageChange(value)}
      />
    </div>
    <div className="col-sm-4 col-lg-2">
      <button
        type="submit"
        className="float-right btn btn-block btn-primary"
        onClick={() => {
          send({ contactlist, sendTo: sendTo || [] }, message, id, verifyMessage === 'verifyMessage');
        }}
      >
Send
      </button>
    </div>
    <div className="col-sm-12">
      <div className="custom-control custom-checkbox form-check text-right">
        <input
          className="custom-control-input"
          type="checkbox"
          id="verifyMessage"
          name="verifyMessage"
          checked={verifyMessage === 'verifyMessage'}
          onChange={() => verifyChange(
            verifyMessage === 'verifyMessage' ? '' : 'verifyMessage',
          )}
        />
        <label className="custom-control-label" htmlFor="verifyMessage">
    Verify Message
        </label>
      </div>
    </div>
  </div>
)));
