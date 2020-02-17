import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { PasswordForgetLink } from '../PasswordForget';

const SignIn = () => (
    <div>
        <h1>SignIn</h1>
        <SignInForm />
        <PasswordForgetLink />
        <SignUpLink />
    </div>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    password: '',
    error: null,
};
class SignInFormBase extends Component {
    componentDidMount() {
        document.getElementById("Apple-Sign-In").onclick = (() => {
            this.props.firebase.handleSignInWithApple();
        });
    }
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    onSubmit = event => {
        const { email, password } = this.state;
        this.props.firebase.doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            })
        event.preventDefault();
    };
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    render() {
        const { email, password, error } = this.state;
        const isInvalid = password === '' || email === '';
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <input
                        name="email"
                        value={email}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Email Address"
                    />
                    <input
                        name="password"
                        value={password}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Password"
                    />
                    <button disabled={isInvalid} type="submit">
                        Sign In
            </button>
                    {error && <p>{error.message}</p>}
                </form>
                <h6 className="signin-button">or </h6>
                <div className="signin-button">
                    <button id="Apple-Sign-In" className="btn btn-link">
                        <img className="signin-button" src="https://appleid.cdn-apple.com/appleid/button?height=64&width=300&type=continue" alt="Sign In With Apple" />
                    </button>
                </div>
            </div>
        );
    }
}
const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);
export default SignIn;
export { SignInForm };