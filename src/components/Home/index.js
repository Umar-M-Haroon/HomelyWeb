import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import './Home.css'
import { ReactComponent as Add } from '../../plus.svg';
import AddItem from './Add Item/AddItemForm'
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            chores: [],
            supplies: [],
            payments: [],
            users: [],
            history: [],
            home: ""
        };
    }
    componentDidMount() {
        var allChores = []
        var allSupplies = []
        var allPayments = []
        var allHistory = []
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
                    //add each payment, supply, and chore that is finished to the allHistory list
                    //iterates through the document's chores/supplies/payments and adds to an array that the home page can read
                    home.History.forEach(historyItem => {
                        if (historyItem.Completed === true) {
                            allHistory.push(historyItem);
                        }
                    })
                   

                    home.Users.forEach(user => {
                        allUsers.push(user);
                    })
                    this.setState({
                        chores: allChores,
                        supplies: allSupplies,
                        payments: allPayments,
                        history: allHistory,
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
        const { chores, supplies, payments, loading, history } = this.state;
        return (
            <div>
                {loading && <div>Loading ...</div>}
                <div className="row no-gutters flex-nowrap">
                    <div className="col">
                        <AddItem users={this.state.users} type="Chores" />
                        {<ChoresList chores={chores} />}
                    </div>
                    <div className="col">
                        <AddItem users={this.state.users} type="Supplies" />
                        {<SuppliesList supplies={supplies} />}
                    </div>
                    <div className="col">
                        <AddItem users={this.state.users} type="Payments" />
                        {<PaymentsList payments={payments} />}
                    </div>
                </div>
                <center><div className="row no-gutters flex-nowrap">
                    <div className="col">
                        {<HistoryList history={history} />}
                    </div>  
                </div></center>   
            </div >
        );

    }
}

const ChoresList = ({ chores }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="Title">
                Chores
                <button className="addButtonFrame" data-toggle="modal" data-target="#Chores"><Add className="addButton"></Add></button>
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
                <button className="addButtonFrame" data-toggle="modal" data-target="#Supplies"><Add className="addButton"></Add></button>
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
                <button className="addButtonFrame" data-toggle="modal" data-target="#Payments"><Add className="addButton"></Add></button>
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

const HistoryList = ({ history }) => (
    
    <div className="historyFrame">
    <ul className="listFrame">
        <h2 className="Title">
            History
        </h2>
    {history.map((historyItem) => (
        <div className="card itemFrame mt-1">
            <div className="card-body">
                <li key={historyItem.Timestamp}>
                    <span className="item">
                        <p className="card-text">Completed By: {historyItem.Author}<br></br>{historyItem["Item ID"]}<br></br>Completed At: {historyItem.Timestamp}</p>
                        {/* <p className="card-text">{historyItem["Item ID"]}</p> */}
                    </span>
                </li>
            </div>
        </div>
    ))}
        
        
    </ul>
    </div>
)

const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(Home));

