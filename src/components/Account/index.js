import React, { Component } from 'react';
import DefaultLogo from '../../Default.png';
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
        if (this.props.firebase.defaultHomeData) {
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
                                    <img className="ProfilePhoto" src={authUser.photoURL ?
                                        authUser.photoURL : DefaultLogo} alt="Profile" />
                                </div>
                                <h2>{authUser.displayName}</h2>
                                <p>Venmo ID: {this.state.venmoID}</p>
                                <PasswordChangeForm />
                                <SignOut />
                                <HomeList firebase={this.props.firebase}></HomeList>
                            </div>
                        </div>
                    ) : (
                            <div className="Master">
                                <div>
                                    <img className="ProfilePhoto" src={authUser.photoURL ?
                                        authUser.photoURL : DefaultLogo} alt="Profile" />
                                </div>
                                <h1>{authUser.displayName}</h1>
                                <p>Venmo ID: {this.state.venmoID}</p>
                                <SignOut />
                                <HomeList firebase={this.props.firebase}></HomeList>
                            </div>
                        )
                }
            </AuthUserContext.Consumer>
        )
    }
}
class HomeList extends Component {
    constructor(props) {
        super(props)
        this.state = { "homes": [], "preferredHome": localStorage.getItem("preferredHome") }
        this.onChange = this.onChange.bind(this)
    }
    componentDidMount() {
        this.props.firebase.homes().get().then((snapshot) => {
            let homes = []
            snapshot.forEach((doc) => {
                homes.push(doc.id)
            })
            this.setState({ "homes": homes })
        })
        console.log(localStorage.getItem('preferredHome'))
    }
    onChange = event => {
        localStorage.setItem('preferredHome', event.target.value)
    };
    render() {
        return (
            <div>
                {this.state.homes.map((home) => (
                    <div key={home}>
                        <div className="form-check">
                            {(this.state.preferredHome === home) &&
                                <input className="form-check-input" onClick={this.onChange} onChange={this.onChange} type="radio" name="exampleRadios" id={home} value={home} checked />
                            }
                            {(this.state.preferredHome !== home) &&
                                <input className="form-check-input" onClick={this.onChange} onChange={this.onChange} type="radio" name="exampleRadios" id={home} value={home} />
                            }
                            <label className="form-check-label" htmlFor={home}>
                                {home}
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}
const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(AccountPage));
