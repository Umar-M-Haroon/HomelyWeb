import React, { Component } from 'react';
import { PasswordForgetForm } from '../PasswordForget';
import { AuthUserContext, withAuthorization } from '../Session'
import PasswordChangeForm from '../PasswordChange';
import SignOut from '../SignOut';
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
                            <PasswordForgetForm />
                            <PasswordChangeForm />
                            <SignOut />
                        </div>
                    ) : (
                            <div>
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
