import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';
import SignOut from '../SignOut';
import './Account.css';
class AccountPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            venmoID: ""
        }
    }
    componentDidMount() {
        if (this.props.firebase.defaultHomeData == null || this.props.firebase.defaultHomeData === undefined) {
            // this.props.firebase.homes()
            //     .then(querySnapshot => {
            //         querySnapshot.forEach(doc => {
            //             var home = doc.data();
            //             this.props.firebase.defaultHome = doc.id
            //             this.props.firebase.defaultHomeData = home
            //             var users = this.props.firebase.defaultHomeData.Users;
            //             var user = users.find(user => user["User ID"] === this.props.firebase.userData())
            //             this.setState({
            //                 venmoID: user["Venmo ID"]
            //             })
            //         })
            //     }).catch(error => {
            //         console.log(error);
            //     });
        } else {
            var users = this.props.firebase.defaultHomeData.Users;
            var user = users.find(user => user["User ID"] === this.props.firebase.userData())
            this.setState({
                venmoID: user["Venmo ID"]
            })
        }
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
                                <p>Venmo ID: {this.state.venmoID}</p>
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
                                <p>Venmo ID: {this.state.venmoID}</p>
                                <SignOut />
                            </div>
                        )
                }
            </AuthUserContext.Consumer>
        )
    }
}
const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(AccountPage));
