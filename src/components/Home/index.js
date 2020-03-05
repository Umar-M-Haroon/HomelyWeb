import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import './Home.css'
import { ReactComponent as Add } from '../../plus.svg';
import Calendar from 'react-calendar';
import AssignedUsers from './Add Item/AssignedUsers/index'
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            chores: [],
            supplies: [],
            payments: [],
            users: [],
            home: ""
        };
    }
    componentDidMount() {
        var allChores = []
        var allSupplies = []
        var allPayments = []
        var allUsers = []
        this.setState({ loading: false });
        this.props.firebase.homes()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    var home = doc.data();
                    home.Chores.forEach(chore => {
                        if (chore.Completed !== true) {
                            allChores.push(chore);
                        }
                    });
                    home.Supplies.forEach(supply => {
                        if (supply.Completed !== true) {
                            allSupplies.push(supply);
                        }
                    });
                    home.Payments.forEach(payment => {
                        if (payment.Completed !== true) {
                            allPayments.push(payment);
                        }
                    })
                    home.Users.forEach(user => {
                        allUsers.push(user);
                    })
                    this.setState({
                        chores: allChores,
                        supplies: allSupplies,
                        payments: allPayments,
                        users: allUsers,
                        home: home,
                        loading: false
                    });

                })
            }).catch(error => {
                console.log(error);
            });
    }

    componentWillUnmount() {
        // this.props.firebase.users().off();
    }

    render() {
        const { chores, supplies, payments, loading } = this.state;
        return (
            <div>
                <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" id="myModalLabel">Add Supply</h4>
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
                                        <label className="modal-subhead" htmlFor="exampleInputEmail1">Deadline Date</label>
                                        {<Calendar />}
                                    </div>
                                    <div className="form-group">
                                        <label className="modal-subhead" htmlFor="exampleInputEmail1">Assign Users</label>
                                        {<AssignedUsers users={this.state.users} />}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <h1><strong>Home</strong></h1>
                {loading && <div>Loading ...</div>}
                <div className="row no-gutters flex-nowrap">
                    <div className="col">
                        {<ChoresList chores={chores} />}
                    </div>
                    <div className="col">
                        {<SuppliesList supplies={supplies} />}
                    </div>
                    <div className="col">
                        {<PaymentsList payments={payments} />}
                    </div>
                </div>
            </div>
        );

    }
}

const ChoresList = ({ chores }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="Title">
                Chores
                <button className="addButtonFrame"><Add className="addButton">A</Add></button>
            </h2>
            {chores.map((chore) => (
                <div className="card itemFrame mt-1">
                    <div className="card-body ">
                        <li key={chore.Timestamp}>
                            <div className="item">
                                <button type="button" className="options btn btn-primary dropdown-toggle" id="dropdownOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</button>
                                <div className="dropdown-menu" aria-labelledby="dropdownOptions">
                                    <button className="dropdown-item">Complete</button>
                                    <button className="dropdown-item">Edit</button>
                                    <button className="dropdown-item">Add to Calender</button>
                                </div>
                                <p className="card-text">{chore.Title}</p>
                            </div>
                        </li>
                    </div>
                </div>
            ))}
        </ul>
    </div >
);

const SuppliesList = ({ supplies }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="Title">
                Supplies
                <button className="addButtonFrame" data-toggle="modal" data-target="#myModal"><Add className="addButton"></Add></button>
            </h2>
            {supplies.map((supply) => (
                <div className="card itemFrame mt-1">
                    <div className="card-body">
                        <li key={supply.Timestamp}>
                            <div className="item">
                                <button type="button" className="options btn btn-primary dropdown-toggle" id="dropdownOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</button>
                                <div className="dropdown-menu" aria-labelledby="dropdownOptions">
                                    <button className="dropdown-item">Complete</button>
                                    <button className="dropdown-item">Edit</button>
                                    <button className="dropdown-item">Add to Calender</button>
                                </div>
                                <p className="card-text">{supply["Supply Title"]}</p>
                            </div>
                        </li>
                    </div>
                </div>
            ))}
        </ul>
    </div >
)
const PaymentsList = ({ payments }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="Title">
                Payments
                <button className="addButtonFrame"><Add className="addButton">A</Add></button>
            </h2>
            {payments.map((payment) => (
                <div className="card itemFrame mt-1">
                    <div className="card-body">
                        <li key={payment.Timestamp}>
                            <span className="item">

                                <button type="button" className="options btn btn-primary dropdown-toggle" id="dropdownOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</button>
                                <div className="dropdown-menu" aria-labelledby="dropdownOptions">
                                    <button className="dropdown-item">Complete</button>
                                    <button className="dropdown-item">Edit</button>
                                    <button className="dropdown-item">Add to Calender</button>
                                </div>
                                <p className="card-text">{payment["Payment Title"]}</p>
                            </span>
                        </li>
                    </div>
                </div>
            ))}
        </ul>
    </div >
)

const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(Home));

