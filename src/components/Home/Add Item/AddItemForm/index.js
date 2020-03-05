import React, { Component } from "react";
import { withAuthorization } from '../../../Session';
import { withFirebase } from '../../../Firebase';
import Calendar from 'react-calendar';
import AssignedUsers from '../AssignedUsers'

class AddItemForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            type: ""
        }
    }
    componentDidMount() {
        this.setState({
            users: this.props.users,
            type: this.props.type
        })
    }
    render() {
        if (this.props.type === "Supplies") {
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
                                            <input type="email" className="form-control col-7 mr-3 ml-1" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter title"></input>
                                            <input type="number" className="form-control col" id="inputQuantity" aria-describedby="quantityHelp" placeholder="Quantity"></input>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="modal-subhead" htmlFor="exampleInputPassword1">Description</label>
                                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                    </div>
                                    <button className="btn btn-link addPhotoButton">
                                        Add Photo
                                </button>
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
        }
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
                                        <input type="email" className="form-control col-7 mr-3 ml-1" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter title"></input>
                                        <input type="number" className="form-control col" id="inputQuantity" aria-describedby="quantityHelp" placeholder="Quantity"></input>
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
                                            {<Calendar minDate={new Date()} />}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="modal-subhead" htmlFor="exampleInputEmail1">Assign Users</label>
                                        {<AssignedUsers users={this.props.users} />}
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
    }
}
const formSupply = () => {

}
const form = () => {

}
const formBase = () => {

}
const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(AddItemForm));