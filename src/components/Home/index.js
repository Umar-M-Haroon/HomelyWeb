import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { ReactComponent as Add } from '../../plus.svg';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import AddItem from './Add Item/AddItemForm';
import './Home.css';
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
        //Set up home page with appropriate data
        this.setState({ loading: false });
        //calls the homes function to get the current homes the user has
        //it then iterates through each home which is a document in firebase terms and will get the data which is a javascript object
        //as it iterates through it adds to a generic home
        this.listener = this.props.firebase.homes().onSnapshot({ includeMetadataChanges: true }, (
            snapshot => {
                snapshot.forEach(doc => {
                    var allChores = []
                    var allSupplies = []
                    var allPayments = []
                    var allUsers = []
                    var venmoUsers = []
                    var home = doc.data();
                    this.props.firebase.defaultHomeData = home
                    this.props.firebase.defaultHome = doc.id
                    //iterates through the document's chores and adds to an array that the home page can read
                    //repeated with supplies and payments
                    if (home.Chores) {
                        home.Chores.forEach(chore => {
                            if (chore.Completed !== true) {
                                allChores.push(chore);
                            }
                        });
                    }
                    if (home.Supplies) {
                        home.Supplies.forEach(supply => {
                            if (supply.Completed !== true) {
                                allSupplies.push(supply);
                            }
                        });
                    }
                    if (home.Payments) {
                        home.Payments.forEach(payment => {
                            if (payment.Completed !== true) {
                                payment.User = this.props.firebase.getUserForItem(home.Users, home.History, payment)
                                allPayments.push(payment);
                            }
                        })
                    }
                    home.Users.forEach(user => {
                        if (user["Venmo ID"] !== undefined && user["Venmo ID"] !== "") {
                            venmoUsers.push(user)
                        }
                        allUsers.push(user);
                    })
                    this.setState({
                        chores: allChores,
                        supplies: allSupplies,
                        payments: allPayments,
                        users: allUsers,
                        home: home,
                        venmoUsers: venmoUsers,
                        loading: false
                    });
                    //while also getting the categories, it also gets the users and sets a default home.
                    //These are needed for assigning users.
                })
            }))
    }

    componentWillUnmount() {
        this.listener()
    }

    render() {
        const { chores, supplies, payments, loading } = this.state;
        return (
            <div>
                <h1><strong>Home</strong></h1>
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
                        {<PaymentsList users={this.state.venmoUsers} payments={payments} />}
                    </div>
                </div>
            </div >
        );

    }
}

const ChoresList = ({ chores }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="homeTitle">
                <Link className="homeTitle" to={ROUTES.CHORES}>Chores</Link>
                <button className="addButtonFrame" data-toggle="modal" data-target="#Chores" aria-labelledby="addChore"><Add className="addButton"></Add></button>
            </h2>
            {chores.map((chore) => (
                <div className="card itemFrame mt-1" key={chore.Timestamp}>
                    <div className="card-body ">
                        <li>
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
            <h2 className="homeTitle">
                <Link className="homeTitle" to={ROUTES.SUPPLIES}>Supplies</Link>
                <button className="addButtonFrame" data-toggle="modal" data-target="#Supplies" aria-labelledby="AddSupply"><Add className="addButton"></Add></button>
            </h2>
            {supplies.map((supply) => (
                <div className="card itemFrame mt-1" key={supply.Timestamp}>
                    <div className="card-body" >
                        <li>
                            <div className="item" >
                                <button type="button" className="options btn btn-primary dropdown-toggle" id="dropdownOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</button>
                                <div className="dropdown-menu" aria-labelledby="dropdownOptions">
                                    <button className="dropdown-item">Complete</button>
                                    <button className="dropdown-item">Edit</button>
                                    <button className="dropdown-item">Add to Calender</button>
                                </div>
                                <p className="card-text" >{supply["Supply Title"]}</p>
                            </div>
                        </li>
                    </div>
                </div>
            ))}
        </ul>
    </div >
)
const PaymentsList = ({ users, payments }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="homeTitle">
                <Link className="homeTitle" to={ROUTES.PAYMENTS}>Payments</Link>
                <button className="addButtonFrame" data-toggle="modal" data-target="#Payments"><Add className="addButton"></Add></button>
            </h2>
            {payments.map((payment) => (
                <div className="card itemFrame mt-1" key={payment.Timestamp}>
                    <div className="card-body">
                        <li key={payment.Timestamp}>
                            <span className="item">

                                <button type="button" className="options btn btn-primary dropdown-toggle" id="dropdownOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</button>
                                <div className="dropdown-menu" aria-labelledby="dropdownOptions">
                                    <button className="dropdown-item">Complete</button>
                                    <button className="dropdown-item">Edit</button>
                                    <button className="dropdown-item">Add to Calender</button>
                                    {/* Payment dropdown. Inactive due to venmo shutting off support :/ */}
                                    {/* <div class="dropdown-divider"></div>
                                    <h6 className="dropdown-header">Pay Users</h6>
                                    {users.map((user) => (
                                        <a href="https://venmo.com" key={user["User ID"]} className="dropdown-item">{"Pay " + user["Display Name"]}</a>
                                    ))} */}

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

