import React, { Component } from 'react';
import { withAuthorization } from '../../../Session';
import { withFirebase } from '../../../Firebase';
class AssignedUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }
    }
    componentDidMount() {
        this.updateUsers()
    }
    updateUsers = () => {
        var userInfo = []
        if (this.props.users.length === 0) {
            console.log("Something was 0")
            return
        }
        if (this.props.users.length === this.state.users.length) {
            console.log("no need to update again")
            return
        }
        this.props.users.forEach(user => {
            this.props.firebase.getImage(user["User ID"]).then(url => {
                console.log(url)
                var userToAppend = user
                userToAppend.imageURL = url
                userInfo.push(userToAppend)
            }).catch(error => {
                console.log(error)
            })
            userInfo.push(user)
        })
        this.setState({
            users: userInfo
        })
    }
    componentDidUpdate() {
        this.updateUsers()
    }
    render() {
        console.log("calling render with user count " + this.state.users.length)
        if (this.state.users.length === 0) { return (<div>No Users!</div>) }
        return (
            <div>
                {this.state.users.forEach(user => (
                    <div>
                        <p>WOOO</p>
                        <img src={user.imageURL} alt="Profile"></img>
                        <p>{user["User ID"]}</p>
                    </div>
                ))}
            </div >
        )
    }
}



const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(AssignedUsers));


