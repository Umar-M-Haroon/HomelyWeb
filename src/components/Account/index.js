import React, { Component } from 'react';
import { PasswordForgetForm } from '../PasswordForget';
import { AuthUserContext, withAuthorization } from '../Session'
import PasswordChangeForm from '../PasswordChange';
import SignOut from '../SignOut';
import './Account.css'
class AccountPage extends Component {
    componentDidMount() {
    }
    render() {
        return (
            <AuthUserContext.Consumer>
                {
                    authUser => authUser.email ? (
                        <div>
                            <h1>Account: {authUser.email}</h1>
                            <h2>{authUser.displayName}</h2>
                            <PasswordForgetForm />
                            <PasswordChangeForm />
                            <SignOut />
                        </div>
                    ) : (
                            <div className="Master">
                                <div>
                                    <img className="ProfilePhoto" src={authUser.photoURL} alt="Profile"></img>
                                </div>
                                <h1>{authUser.displayName}</h1>
                                <SignOut/>
                            </div>
                        )
                }
            </AuthUserContext.Consumer>
        )
    }
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);
