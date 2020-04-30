import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import './PasswordChange.css';
const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};
class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { passwordOne } = this.state;
    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { passwordOne, passwordTwo, error } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';
    return (
      <div className="form-group PasswordChangeFrame">
        <form className="p5" onSubmit={this.onSubmit} >
          <div className="form-row">
            <div className="col">
              <div>
                <label className="form-text text-muted">New Password</label>
                <input
                  name="passwordOne"
                  value={passwordOne}
                  onChange={this.onChange}
                  type="password"
                  placeholder="New Password"
                  className="form-control mb-4"
                />
              </div>
              <div>
                <label className="form-text text-muted">Confirm New Password</label>
                <input
                  name="passwordTwo"
                  value={passwordTwo}
                  onChange={this.onChange}
                  type="password"
                  placeholder="Confirm New Password"
                  className="form-control mb-4"
                />
              </div>
              <button disabled={isInvalid} type="submit" className="btn btn-primary">Set New Password </button>
            </div>
          </div>
          {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}
export default withFirebase(PasswordChangeForm);