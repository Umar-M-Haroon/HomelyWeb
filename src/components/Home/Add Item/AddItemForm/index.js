import React, { Component } from "react";
import Calendar from 'react-calendar';
import { withFirebase } from '../../../Firebase';
import { withAuthorization } from '../../../Session';
import AssignedUsers from '../AssignedUsers';
import Toast from 'react-bootstrap/Toast';
import lottie from 'lottie-web';
import success from '../../../../Lottie Animations/Success Animation.json'
import "./AddItemForm.css"
class AddItemForm extends Component {
    constructor(props) {
        super(props)
        this.addButtonPressed = this.addButtonPressed.bind(this);
        this.handleCalendarChange = this.handleCalendarChange.bind(this)
        this.handleUserChange = this.handleUserChange.bind(this)
        this.state = {
            assignedUsers: [],
            DeadlineDate: null,
            Description: null,
            title: null,
            hasAdded: false,
            show: false
        }
    }
    addButtonPressed() {
        var title = document.getElementById("title" + this.props.type).value
        this.setState({
            title: title,
            // Description: document.getElementById("Description" + this.props.type).value,
            // Quantity: document.getElementById("inputQuantity" + this.props.type).value
        }, () => {
            // this.props.firebase.addItem(this.state, this.props.type)
            this.setState({ show: true })
            setTimeout(() => {
                lottie.goToAndStop(0)
                lottie.play()
            }, 300)
        })
    }
    handleCalendarChange(event) {
        this.setState({
            DeadlineDate: event
        })
    }
    handleUserChange(users) {
        this.setState({
            assignedUsers: users
        })
    }
    setShow(show) {
        this.setState({ show: show })
    }
    render() {
        const toastElement = document.getElementById("lottie")
        if (toastElement) {
            if (toastElement.children.length < 1) {
                lottie.loadAnimation({
                    container: toastElement,
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    animationData: success,
                    rendererSettings: {
                        className: "lottie",
                        clearCanvas: true,
                        id: "lottie"
                    }
                })
            }
        }

        return (
            <div>
                <div className="modal fade" id={this.props.type} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">Add {this.props.type}</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <div className="form-row">
                                            <label className="modal-subhead col-7 mr-3 ml-1" htmlFor={"title" + this.props.type}>Title</label>
                                            {
                                                this.props.type === "Supplies" &&
                                                <label className="modal-subhead col" htmlFor={"inputQuantity" + this.props.type}>Quantity</label>
                                            }
                                            {
                                                this.props.type === "Payments" &&
                                                <label className="modal-subhead col" htmlFor={"inputQuantity" + this.props.type}>Amount</label>
                                            }
                                        </div>
                                        <div className="form-row">
                                            <input type="text" className="form-control col-7 mr-3 ml-1" id={"title" + this.props.type} aria-describedby="Title Help" placeholder="Enter title" required></input>
                                            {
                                                this.props.type === "Supplies" &&
                                                <input type="number" className="form-control col" id={"inputQuantity" + this.props.type} aria-describedby="quantityHelp" placeholder="Quantity" required></input>
                                            }
                                            {
                                                this.props.type === "Payments" &&
                                                <input type="number" className="form-control col" id={"inputQuantity" + this.props.type} aria-describedby="Amount Help" placeholder="Amount" required></input>
                                            }
                                        </div>
                                    </div>
                                    {
                                        this.props.type !== "Chores" &&
                                        <div className="form-group">
                                            <label className="modal-subhead" htmlFor="exampleInputPassword1">Description</label>
                                            <textarea className="form-control" id={"Description" + this.props.type} rows="3"></textarea>
                                        </div>
                                    }

                                    {
                                        this.props.type !== "Chores" &&
                                        <button className="btn btn-link addPhotoButton">Add Photo</button>
                                    }

                                    {
                                        this.props.type !== "Supplies" &&
                                        <div className="form-group">
                                            <div className="form-group">
                                                <label className="modal-subhead" htmlFor="exampleInputEmail1">Deadline Date</label>
                                                <div className="calendarGroup">
                                                    {<Calendar minDate={new Date()} onChange={(e) => this.handleCalendarChange(e)} />}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="modal-subhead" htmlFor="exampleInputEmail1">Assign Users</label>
                                                {<AssignedUsers id={"users" + this.props.type} users={this.props.users} handleUserChange={(e) => { this.handleUserChange(e) }} />}
                                            </div>
                                        </div>
                                    }
                                </form>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={this.addButtonPressed} data-dismiss="modal">Add Item</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <Toast show={this.state.show} onClose={() => this.setShow(false)} delay={2000} autohide>
                        <Toast.Header>
                            <div id="lottie" className="lottie" />
                            <strong>Successfully added item!</strong>
                        </Toast.Header>
                    </Toast> */}
                </div >
            </div >
        )
    }
}
const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(AddItemForm));