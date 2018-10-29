import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions';

const conn = ({
  connectionChange, myName, address, createConnection, connection,
}) => (
  <div className="my-3 p-3 bg-white rounded shadow-sm">
    <div className="form-group row">
      <div className="col-sm-8">
        <input
          className="form-control"
          onChange={({ target: { value } }) => connectionChange(value)}
          placeholder="name@Address:Port"
          value={connection}
        />
      </div>
      <div className="col-sm-4 float-right">
        <button
          type="submit"
          className="float-right btn btn-block btn-primary"
          onClick={() => { createConnection(myName, address); }}
        >
Connect
        </button>
      </div>
    </div>
  </div>
);

export default connect(
  state => ({ ...state.connectionReducer }),
  dispatch => bindActionCreators(Actions, dispatch),
)(conn);
