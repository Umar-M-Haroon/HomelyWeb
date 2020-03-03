import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import './Home.css'
import { ReactComponent as Add } from '../../plus.svg';
import Calendar from 'react-calendar';
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            chores: [],
            supplies: [],
            payments: []
        };
    }
    componentDidMount() {
        var allChores = []
        var allSupplies = []
        var allPayments = []
        this.setState({ loading: false });
        this.props.firebase.homes()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {

                    doc.data().Chores.forEach(chore => {
                        if (chore.Completed !== true) {
                            allChores.push(chore);
                        }
                    });
                    doc.data().Supplies.forEach(supply => {
                        if (supply.Completed !== true) {
                            allSupplies.push(supply);
                        }
                    });
                    doc.data().Payments.forEach(payment => {
                        if (payment.Completed !== true) {
                            allPayments.push(payment);
                        }
                    })
                    this.setState({
                        chores: allChores,
                        supplies: allSupplies,
                        payments: allPayments,
                        loading: false
                    })
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
            <div className="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" id="myModalLabel">Add Supply</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">&times;</button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label className="modal-subhead" for="exampleInputEmail1">Title</label>
                                    <div className="form-row">
                                        <input type="email" className="form-control col-7 mr-3 ml-1" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter title"></input>
                                        <input type="number" className="form-control col" id="inputQuantity" aria-describedby="quantityHelp" placeholder="Quantity"></input>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="modal-subhead" for="exampleInputPassword1">Description</label>
                                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>
                                <button className="btn btn-link addPhotoButton">
                                    Add Photo
                                </button>
                                <div className="form-group">
                                    <label className="modal-subhead" for="exampleInputEmail1">Deadline Date</label>
                                    <Calendar />
                                </div>
                                <div className="form-group">
                                    <label className="modal-subhead" for="exampleInputEmail1">Assign Users</label>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Add Item</button>
                        </div>
                    </div>
                </div>
            </div>
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

