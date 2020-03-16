import React, { Component } from "react";
import { withAuthorization } from '../../../Session';
import { withFirebase } from '../../../Firebase';
import Calendar from 'react-calendar';
import AssignedUsers from '../AssignedUsers'

class AddItemForm extends Component {
    constructor(props) {
        super(props)
        this.addButtonPressed = this.addButtonPressed.bind(this);
        this.handleChoreUserChange = this.handleChoreUserChange.bind(this);
        this.handleChoreCalendarChange = this.handleChoreCalendarChange.bind(this)
        this.handlePaymentUserChange = this.handlePaymentUserChange.bind(this);
        this.handlePaymentCalendarChange = this.handlePaymentCalendarChange.bind(this)

        this.state = {
            choreUsers: [],
            choreDeadlineDate: null,
            paymentUsers: [],
            paymentDeadlineDate: null,
            supplyDescription: null,
            paymentDescription: null,
            supplyQuantity: null,
            paymentQuantity: null,
            title: null,
            
        }
    }
    addButtonPressed() {
        var title, paymentDescription, supplyDescription
        title = document.getElementById("title" + this.props.type).value
        switch (this.props.type) {
            case "Supplies":
                supplyDescription = document.getElementById("description" + this.props.type).value
                break
            case "Payments":
                paymentDescription = document.getElementById("description" + this.props.type).value
                break
            default:
                break
        }
        this.setState({
            title: title,
            paymentDescription: paymentDescription,
            supplyDescription: supplyDescription
        })
        this.props.firebase.addItem(this.state, this.props.type)
    }
    handleChoreUserChange(users) {
        this.setState({
            choreUsers: users
        })
    }
    handleChoreCalendarChange(event) {
        this.setState({
            choreDeadlineDate: event
        })
    }
    handlePaymentCalendarChange(event) {
        this.setState({
            paymentDeadlineDate: event
        })
    }

    handlePaymentUserChange(users) {
        this.setState({
            paymentUsers: users
        })
    }
    render() {
        switch (this.props.type) {
            case "Supplies":
                return (
                    //form without calendar and assigning users. Supplies doesn't need all that because people might micromanage it then. 
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
                                                <label className="modal-subhead col" htmlFor={"inputQuantity" + this.props.type}>Quantity</label>
                                            </div>
                                            <div className="form-row">
                                                <input type="email" className="form-control col-7 mr-3 ml-1" id={"title" + this.props.type} aria-describedby="Title Help" placeholder="Enter title" required></input>
                                                <input type="number" className="form-control col" id={"inputQuantity" + this.props.type} aria-describedby="quantityHelp" placeholder="Quantity" required></input>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-subhead" htmlFor={"description" + this.props.type}>Description</label>
                                            <textarea className="form-control" id={"description" + this.props.type} rows="3"></textarea>
                                        </div>
                                        <button className="btn btn-link addPhotoButton">
                                            Add Photo
                                    </button>
                                    </form>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary" onClick={this.addButtonPressed}>Add Item</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "Chores":
                return (
                    <div className="modal fade" id={this.props.type} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title" id="myModalLabel">Add {this.props.type}</h4>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">&times;</button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={this.addButtonPressed}>
                                        <div className="form-group">
                                            <div className="form-row">
                                                <label className="modal-subhead col-7 mr-3 ml-1" htmlFor={"title" + this.props.type}>Title</label>
                                            </div>
                                            <div className="form-row">
                                                <input type="text" className="form-control col-7 mr-3 ml-1" id={"title" + this.props.type} aria-describedby="Title Help" placeholder="Enter title"></input>
                                            </div>

                                        </div>
                                        <button className="btn btn-link addPhotoButton">
                                            Add Photo
                                    </button>
                                        <div className="form-group">
                                            <div className="form-group">
                                                <label className="modal-subhead" htmlFor="exampleInputEmail1">Deadline Date</label>
                                                <div className="calendarGroup">
                                                    {<Calendar minDate={new Date()} onClickDay={this.handleChoreCalendarChange} />}
                                                    {/* <label>Time</label>
                                                    <input id={"time" + this.props.type} className="form-control" type="time" disabled></input> */}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="modal-subhead" htmlFor="exampleInputEmail1">Assign Users</label>
                                                {<AssignedUsers id={"users" + this.props.type} users={this.props.users} handleUserChange={this.handleChoreUserChange} />}
                                            </div>
                                        </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary" onClick={this.addButtonPressed}>Add Item</button>
                                    </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case "Payments":
                return (
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
                                            <label className="modal-subhead" htmlFor="exampleInputEmail1">Title</label>
                                            <div className="form-row">
                                                <input type="email" className="form-control col-7 mr-3 ml-1" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter title" required></input>
                                                <input type="number" className="form-control col" id="inputQuantity" aria-describedby="quantityHelp" placeholder="Quantity" required></input>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="modal-subhead" htmlFor="exampleInputPassword1">Description</label>
                                            <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                        </div>
                                        <button className="btn btn-link addPhotoButton">
                                            Add Photo
                                </button>
                                        <div className="form-group">
                                            <div className="form-group">
                                                <label className="modal-subhead" htmlFor="exampleInputEmail1">Deadline Date</label>
                                                <div className="calendarGroup">
                                                    {<Calendar minDate={new Date()} onChange={this.handlePaymentCalendarChange} />}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="modal-subhead" htmlFor="exampleInputEmail1">Assign Users</label>
                                                {<AssignedUsers id={"users" + this.props.type} users={this.props.users} handleUserChange={this.handlePaymentUserChange} />}
                                            </div>
                                        </div>
                                    </form>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal">Add Item</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            default:
                break
        }

    }
}
const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(AddItemForm));