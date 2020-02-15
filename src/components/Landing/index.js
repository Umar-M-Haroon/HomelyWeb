import React, { Component } from 'react';
import './Landing.css';
import { ReactComponent as Logo } from '../../homely-logo.svg';
import SignUp from '../SignUp';
import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';
class Landing extends Component {
    render() {
        return (

            <div>
                <div className="Main">
                    <AuthUserContext.Consumer>
                        {
                            authUser => authUser ? this.props.history.push(ROUTES.HOME) : <SignUpLanding />
                        }

                    </AuthUserContext.Consumer>
                </div>
            </div>
        );
    }
}
const SignUpLanding = () => (
    <div className="Main">
        <h1 className="Title">Welcome to Homely!</h1>
        <Logo className="Homely-Logo">Homely Logo</Logo>
        <h3 className="Title">Sign in or sign up to get started</h3>
        <SignUp />
    </div>
)
export default Landing;