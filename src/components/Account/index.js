import React, { Component } from 'react';
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
                            <h1>Account</h1>
                            <div className="Master">
                                <div>
                                    <img className="ProfilePhoto" src={authUser.photoURL} alt="Profile" />
                                </div>
                                <h2>{authUser.displayName}</h2>
                                <PasswordChangeForm />
                                <SignOut />
                            </div>
                        </div>
                    ) : (
                            <div className="Master">
                                <div>
                                    <img className="ProfilePhoto" src={authUser.photoURL} alt="Profile" />
                                </div>
                                <h1>{authUser.displayName}</h1>
                                <SignOut />
                            </div>
                        )
                }
            </AuthUserContext.Consumer>
        )
    }
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);
