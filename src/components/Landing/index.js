import React, { Component } from 'react';
import * as ROUTES from '../../constants/routes';
import { ReactComponent as Logo } from '../../homely-logo.svg';
import { AuthUserContext } from '../Session';
import SignIn from '../SignIn';
import './Landing.css';
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
class SignUpLanding extends Component {

    render() {
        return (<div className="Main">
            <Logo className="Homely-Logo">Homely Logo</Logo>
            <SignIn />
        </div>)
    }
}
export default Landing;