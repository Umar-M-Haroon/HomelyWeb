import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

class CreateHomeBase extends Component {
    constructor(props) {
        super(props)
        this.joinHomeButtonPressed = this.joinHomeButtonPressed.bind(this)
        this.joinHomeFormButtonPressed = this.joinHomeFormButtonPressed.bind(this)
    }

    updateInfo() {
        this.props.history()
    }

    joinHomeButtonPressed() {
        console.log("Button Test");
        var container = document.getElementById("CreateHomeForm")
        container.hidden = !container.hidden
    }
    joinHomeFormButtonPressed(e) {
        console.log(e)
        console.log("Form Button Test");
        e.preventDefault()
    }

    render() {
        return (
            <div id="CreateHomeContainer">
                <button type="button" onClick={() => { this.joinHomeButtonPressed() }} className="btn btn-primary">
                    Join Home
                </button>
                <br></br>
                <form id="JoinHomeForm" hidden={false} onSubmit={this.joinHomeFormButtonPressed}>
                    <div className="form-group">
                        <label >
                            Enter a Home ID to join a home.
                            <input type="text" className="form-control" id="homeIDInput" aria-describedby="homeID Help" placeholder="Home ID"></input>
                        </label>
                    </div>
                    <input className="btn btn-primary" type="submit" value="Join Home" />
                </form >
                <button type="button" className="btn btn-link">
                    Create a New Home
                </button>
                <br></br>
                <form id="CreateHomeForm" hidden={false} onSubmit={this.joinHomeFormButtonPressed}>
                    <div className="form-group">
                        <label>
                            Home Name (Optional)
                        <input type="email" className="form-control" id="HomeNameInput" aria-describedby="Home Name" placeholder="P. Sherman 42 Wallaby Way"></input>
                        </label>
                    </div>
                    <input className="btn btn-primary" type="submit" value="Submit" />
                </form >
                <Link to={ROUTES.HOME}>Home</Link>
            </div >
        )
    }
}

const CreateHome = compose(withRouter, withFirebase)(CreateHomeBase)
export default CreateHome