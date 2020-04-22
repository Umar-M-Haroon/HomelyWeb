import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import { PasswordForgetLink } from '../PasswordForget';
import { SignUpLink } from '../SignUp';
import './SignIn.css';

const SignIn = () => (
    <div className="SignInFrame">

        <SignInForm />
        <br></br>
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
                // this.props.history.push(ROUTES.HOME);
                this.props.firebase.homes().get().then((snapshot) => {
                    if (!snapshot.docs.length > 0) {
                        this.props.history.push(ROUTES.HOME);
                    } else {
                        this.props.history.push(ROUTES.CREATE_HOME);
                    }
                })
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
            <div className="SignInFrame">
                <form className="p5" onSubmit={this.onSubmit}>
                    <br></br>
                    <div className="form-group">
                        <label for="EmailAddress" className="">Email Address</label>
                        <input
                            name="email"
                            className="form-control form-control-lg mb-4"
                            value={email}
                            onChange={this.onChange}
                            type="email"
                            placeholder="Email Address"
                            id="EmailAddress"
                        />
                    </div>
                    <div className="form-group">
                        <label for="password">Password</label>
                        <input
                            name="password"
                            className="form-control form-control-lg mb-4"
                            value={password}
                            onChange={this.onChange}
                            type="password"
                            placeholder="Password"
                            id="Password"
                        />
                    </div>
                    <div className="form-group text-center">
                        <button disabled={isInvalid} className="btn btn-dark btn-lg center" type="submit">
                            Sign In
                    </button>
                    </div>
                    {error && <p>{error.message}</p>}
                </form>
                <h5 className="signin-button">or </h5>
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

