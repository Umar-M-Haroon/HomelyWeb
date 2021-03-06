import React, { Component } from 'react';
import { ReactComponent as Check } from '../../../../check.svg';
import DefaultLogo from '../../../../Default.png';
import { withFirebase } from '../../../Firebase';
import { withAuthorization } from '../../../Session';
import './AssignedUsers.css';
class AssignedUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            assignedUsers: []
        }
        this.buttonClick = this.buttonClick.bind(this);
    }
    componentDidMount() {
        this.updateUsers()
    }
    updateUsers = () => {
        if (this.props.users.length === 0) {
            return
        }
        var promises = []
        this.props.users.forEach((user) => {
            var userToAppend = user
            var promise = new Promise((resolve, reject) => {
                this.props.firebase.getImage(user["User ID"]).then(url => {
                    userToAppend.imageURL = url
                    resolve(userToAppend)
                }).catch(error => {
                    console.log(error)
                    userToAppend.imageURL = DefaultLogo
                    resolve(userToAppend)
                })
            })
            promises.push(promise)
        })
        Promise.all(promises).then(values => {
            this.setState({
                users: values
            })
        })
    }
    componentDidUpdate() {
        if (this.state.users.length !== 0) {
            return
        } else {
            this.updateUsers()
        }
    }
    buttonClick(id, e) {
        var person = document.getElementById(id + this.props.id);
        var users = this.state.assignedUsers;
        if (person.children[1].style.visibility === "visible") {
            person.children[1].style.visibility = "hidden"
            users.splice(users.indexOf(id), 1)
        } else {
            person.children[1].style.visibility = "visible"
            users.push(id)
        }
        this.setState({
            assignedUsers: users
        })
        this.props.handleUserChange(users);
    }
    render() {
        if (this.state.users.length === 0) { return (<div>No Users!</div>) }
        return (
            <div>
                {this.props.users.map(user => (
                    <button type="button" name="Select User" key={user["User ID"]}>
                        <div className="profile" id={user["User ID"] + this.props.id}>
                            <img src={user.imageURL} alt="Profile" className="profileImage" onClick={(e) => this.buttonClick(user["User ID"], e)}></img>
                            <Check className="Check" />
                            <p>{user["Display Name"]}</p>
                        </div>
                    </button>
                ))}
            </div >
        )
    }
}



const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(AssignedUsers));


