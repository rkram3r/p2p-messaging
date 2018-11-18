import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../logic/actions';

export default connect(
  state => ({ ...state.connectionReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(({
  connectionChange, myName, address, createConnection, connection,
}) => (
  <div className="form-group row shadow-sm py-3">
    <div className="col-sm-8 col-lg-10">
      <input
        className="form-control"
        onChange={({ target: { value } }) => connectionChange(value)}
        placeholder="name@Address:Port"
        value={connection}
      />
    </div>
    <div className="col-sm-4 col-lg-2">
      <button
        type="submit"
        className="float-right btn btn-block btn-primary"
        onClick={() => { createConnection(myName, address); }}
      >
      Connect
      </button>
    </div>
  </div>
));
