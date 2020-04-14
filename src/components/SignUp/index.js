import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import './SignUp.css';



const SignUpPage = () => (
    <div>
        <SignUpForm />
    </div>
);
const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};
class SignUpFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    componentDidMount() {
        document.getElementById("Apple-Sign-In").onclick = (()=>{
            this.props.firebase.handleSignInWithApple();
        });
    }
    onSubmit = event => {
        const { email, passwordOne } = this.state;
        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                this.setState({ ...INITIAL_STATE });
                // this.props.firebase.homes().get().then((snapshots) => {
                //     if (!snapshots.isEmpty) {
                //         this.props.history.push(ROUTES.HOME);
                //     }
                // })
                this.props.history.push(ROUTES.CREATE_HOME)
            })
            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    }
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }
    validateEmail = (email) => {
        const expression = /^(([^<>()[]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}​.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return expression.test(String(email).toLowerCase())
    }

    render() {
        const {
            username,
            email,
            passwordOne,
            error,
        } = this.state;
        const isInvalid =
            passwordOne.length <= 7 ||
            this.validateEmail(email) ||
            username === '';
        return (
            <container>
                <div class="Absolute-Center is-Responsive">
                    <h1 align="center">Sign Up</h1>
                    <br></br>
                    <form class="text-center p5" onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <input className="form-control form-control-lg  mb-4"
                                name="username"
                                value={username}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Display Name"
                            />
                        </div>
                        <div className="form-group">
                            <input className="form-control form-control-lg  mb-4"
                                name="email"
                                value={email}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Email Address"
                            />
                        </div>
                        <div className="form-group">
                            <input className="form-control form-control-lg  mb-4"
                                name="passwordOne"
                                value={passwordOne}
                                onChange={this.onChange}
                                type="password"
                                placeholder="Password"
                            />
                            <small className="form-text text-muted">Passwords must be at least 8 characters long</small>
                        </div>
                        <button disabled={isInvalid} type="submit" className="btn btn-dark btn-lg">Sign Up</button>
                        {error && <p>{error.message}</p>}
                    </form>
                    <div>
                        <h5 className="signin-button">or</h5>
                    </div>
                    
                    <div className="signin-button">
                        <button id="Apple-Sign-In" className="btn btn-link">
                            <img className="signin-button" src="https://appleid.cdn-apple.com/appleid/button?height=64&width=300&type=continue" alt="Sign In With Apple" />
                        </button>
                    </div>
                </div>
            </container>
        );
    }
}
const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
)
const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);
export default SignUpPage;
export { SignUpForm, SignUpLink };

