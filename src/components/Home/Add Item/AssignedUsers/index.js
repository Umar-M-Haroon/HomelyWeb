import React, { Component } from 'react';
import { withAuthorization } from '../../../Session';
import { withFirebase } from '../../../Firebase';
import './AssignedUsers.css'
import { ReactComponent as Check } from '../../../../check.svg';
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
                    userToAppend.imageURL = ""
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
        var person = document.getElementById(id);
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
    }
    render() {
        if (this.state.users.length === 0) { return (<div>No Users!</div>) }
        return (
            <div>
                {this.props.users.map(user => (
                    <div className="profile" id={user["User ID"]}>
                        <img src={user.imageURL} alt="Profile" className="profileImage" onClick={(e) => this.buttonClick(user["User ID"], e)}></img>
                        <Check className="Check" />
                        <p>{user["Display Name"]}</p>
                    </div>
                ))}
            </div >
        )
    }
}



const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(AssignedUsers));


