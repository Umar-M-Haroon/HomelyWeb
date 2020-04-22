import qrcode from 'qrcode';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

class CreateHomeBase extends Component {
    constructor(props) {
        super(props)
        this.joinHomeFormButtonPressed = this.joinHomeFormButtonPressed.bind(this)
        this.createHomeButtonPressed = this.createHomeButtonPressed.bind(this)
        this.createHomeFormButtonPressed = this.createHomeFormButtonPressed.bind(this)
    }

    updateInfo() {
        this.props.history()
    }
    loadQR() {
        if (this.props.firebase.auth.currentUser === null) { return }
        var canvasElement = document.getElementById("qrcode")
        var newURL = new URL("https://homelyweb.com/join/")
        newURL.search = new URLSearchParams({ "user": this.props.firebase.auth.currentUser.uid })
        var body = {
            "dynamicLinkInfo": {
                "domainUriPrefix": "https://homelyapp.page.link",
                "link": newURL,
                "iosInfo": {
                    "iosBundleId": "com.Komodo.Homely",
                },
            },
            "suffix": {
                "option": "UNGUESSABLE"
            }
        }
        var jsonBody = JSON.stringify(body)
        fetch(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.REACT_APP_API_KEY}`, {
            method: 'POST',
            body: jsonBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            response.json().then((result) => {
                console.log(result)
                qrcode.toCanvas(canvasElement, result.shortLink, { scale: 10 }, (error) => {
                })
            })
        }).catch((error) => {
            console.log("REJECTED")
            console.log(error)
        })
    }
    createHomeButtonPressed() {
        var container = document.getElementById("CreateHomeForm")
        container.hidden = !container.hidden
    }
    joinHomeFormButtonPressed(e) {
        console.log(e)
        var enteredID = document.getElementById("homeIDInput")
        this.props.firebase.joinHome(enteredID)
        console.log("Form Button Test");

        e.preventDefault()
    }
    createHomeFormButtonPressed(e) {
        e.preventDefault()
    }

    render() {

        return (
            <center>
                <div id="CreateHomeContainer">
                    <label>Have a roommate scan the QR Code to join a home</label>
                    <br />

                    <canvas id="qrcode" width="500px" height="500px"></canvas>
                    {this.loadQR()}
                    <br />
                    <strong><p>OR</p></strong>
                    <form id="JoinHomeForm" hidden={false} onSubmit={this.joinHomeFormButtonPressed}>
                        <div className="form-group">
                            <label >
                                I have a link
                            <small className="form-text text-muted">Enter the Home ID given to you by your roommate in order to connect to the Home.</small>
                                <input type="text" className="form-control" id="homeIDInput" aria-describedby="homeID Help" placeholder="Home Link"></input>
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary">Join Home</button>
                    </form>
                    <button type="button" className="btn btn-link" onClick={this.createHomeButtonPressed}>
                        Create a New Home
                    </button>
                    <br></br>
                    <form id="CreateHomeForm" hidden={true} onSubmit={this.joinHomeFormButtonPressed}>
                        <div className="form-group">
                            <label>
                                Home Name (Optional)
                        <input type="email" className="form-control" id="HomeNameInput" aria-describedby="Home Name" placeholder="P. Sherman 42 Wallaby Way"></input>
                            </label>
                        </div>
                        <input className="buttonStyle" type="submit" value="Submit" />
                    </form >
                    <Link to={ROUTES.HOME}>Home</Link>
                </div>
            </center >
        )
    }
}

const CreateHome = compose(withRouter, withFirebase)(CreateHomeBase)
export default CreateHome