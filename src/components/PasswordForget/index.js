import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

const PasswordForget = () => (
    <div>
        <h1>PasswordForget</h1>
        <PasswordForgetForm />
    </div>
);

const INITIAL_STATE = {
    email: '',
    error: null,
}

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    onSubmit = event => {
        const { email } = this.state;
        this.props.firease.doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE })
            }).catch(error => {
                this.setState({ error });
            })
        event.preventDefault();
    };
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    render() {
        const { email } = this.state;
        const isInvalid = email === '';
        return (
            <div className="form-group">
                <strong >Reset Password</strong>
                <form onSubmit={this.onSubmit}>
                    <div className="form-row">
                        <div className="col">
                            <input type="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.onChange}
                                placeholder="Email Address" />
                            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else</small>
                            <button disabled={isInvalid} type="submit" className="btn btn-primary">Reset My Password</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
const PasswordForgetLink = () => (
    <p>
        <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password</Link>
    </p>
)
export default PasswordForget;
const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
export { PasswordForgetForm, PasswordForgetLink };
