import React, { Component } from 'react';
import { withAuthorization } from '../../../Session';
import { withFirebase } from '../../../Firebase';
import './AssignedUsers.css'
class AssignedUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
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
        document.getElementById(id);
    }
    render() {
        if (this.state.users.length === 0) { return (<div>No Users!</div>) }
        return (
            <div>
                {this.props.users.map(user => (
                    <div className="profile" id={user["User ID"]}>
                        <img src={user.imageURL} alt="Profile" className="profileImage" onClick={(e) => this.buttonClick(user["User ID"], e)}></img>
                        <p>{user["Display Name"]}</p>
                    </div>
                ))}
            </div >
        )
    }
}



const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(AssignedUsers));


