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
           <center>
               <div id="CreateHomeContainer"> <br></br>
                <button type="button" onClick={() => { this.joinHomeButtonPressed() }} className="btn btn-link">
                    Toggle Home
                </button>
                <br></br><br></br>
                <form id="JoinHomeForm" hidden={false} onSubmit={this.joinHomeFormButtonPressed}>
                    <div className="form-group">
                        <label >
                            Enter a Home ID to join a home
                            <input type="text" className="form-control" id="homeIDInput" aria-describedby="homeID Help" placeholder="Home ID"></input>
                        </label>
                        <p><small><small>Put in the Home ID given to you by your roommate in order to connect to the Home.</small></small></p>
                    </div>
                    <input className="buttonStyle" type="submit" value="Join Home" />
                </form > <br></br><br></br>
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
                        <p><small><small>Input must be an email.</small></small></p>
                    </div>
                    <input className="buttonStyle" type="submit" value="Submit" />
                </form >
                <Link to={ROUTES.HOME}>Home</Link>
            </div ></center>
        )
    }
}

const CreateHome = compose(withRouter, withFirebase)(CreateHomeBase)
export default CreateHome