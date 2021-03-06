import React, { Component } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import DefaultLogo from '../../Default.png';
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
            history: [],
            home: ""
        };
    }
    notifyMe() {
        // Let's check if the browser supports notifications
        if (this.state.loading) { return }
        if (!("Notification" in window)) {
        } else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            new Notification("An Item was Added");
            return
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    new Notification("An Item was Added");
                }
            });
        }

    }
    componentDidMount() {
        //Set up home page with appropriate data
        //calls the homes function to get the current homes the user has
        //it then iterates through each home which is a document in firebase terms and will get the data which is a javascript object
        //as it iterates through it adds to a generic home
        this.listener = this.props.firebase.homes().onSnapshot({ includeMetadataChanges: true }, (
            snapshot => {
                if (snapshot.docs.length === 0) {
                    this.props.history.push(ROUTES.CREATE_HOME)
                    return
                }
                var preferredHome = localStorage.getItem('preferredHome')
                let doc = snapshot.docs[0]
                if (preferredHome) {
                    if (snapshot.docs.find(doc => doc.id === preferredHome)) {
                        doc = snapshot.docs.find(doc => doc.id === preferredHome)
                    }

                }
                // snapshot.forEach(doc => {
                if (!this.state.loading) {
                    //we have a change in the house, this isn't the first time loading.
                    this.notifyMe()
                }
                this.setState({ loading: false });
                var allChores = []
                var allSupplies = []
                var allPayments = []
                var allUsers = []
                var allHistory = []
                var venmoUsers = []
                var home = doc.data();
                this.props.firebase.defaultHomeData = home
                this.props.firebase.defaultHome = doc.id
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
                    allHistory.push(historyItem);
                })

                home.Users.forEach(user => {
                    if (user["Venmo ID"] !== undefined && user["Venmo ID"] !== "") {
                        venmoUsers.push(user)
                    }
                    allUsers.push(user);
                    this.props.firebase.getImage(user["User ID"])
                        .then((url) => {

                            var userURLs = {}
                            if (this.state.userURLs !== undefined) {
                                userURLs = this.state.userURLs
                            }
                            if (url === undefined) { return }
                            var userID = user["User ID"]
                            userURLs[userID] = url

                            this.setState({
                                userURLs: userURLs
                            })
                        })
                        .catch((error) => {
                            // console.error(`Error getting URL ${error}`)
                        })
                })
                this.setState({
                    chores: allChores,
                    supplies: allSupplies,
                    payments: allPayments,
                    history: allHistory,
                    users: allUsers,
                    home: home,
                    venmoUsers: venmoUsers,
                    loading: false,
                });
                //while also getting the categories, it also gets the users and sets a default home.
                //These are needed for assigning users.
            })
        )
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener()
        }
    }

    render() {
        const { chores, supplies, payments, loading, history } = this.state;
        return (
            <div>
                {loading && <div>Loading ...</div>}
                <div>
                    <h1><strong>  Homely</strong></h1>
                </div>
                <div className="row no-gutters flex-nowrap">
                    <div className="col">
                        <AddItem users={this.state.users} type="Chores" />
                        {<ChoresList chores={chores} firebase={this.props.firebase} />}
                    </div>
                    <div className="col">
                        <AddItem users={this.state.users} type="Supplies" />
                        {<SuppliesList supplies={supplies} firebase={this.props.firebase} />}
                    </div>
                    <div className="col">
                        <AddItem users={this.state.users} type="Payments" />
                        {<PaymentsList users={this.state.venmoUsers} payments={payments} firebase={this.props.firebase} />}
                    </div>
                </div>
                <div className="row no-gutters flex-nowrap">
                    <div className="col">
                        {<HistoryList history={history} home={this.state.home} imageURLs={this.state.userURLs} />}
                    </div>
                    <div className="col">
                        <Calendar className="homeCalendar" tileClassName="CalendarTileName" tileContent={({ activeStartDate, date, view }) => <TotalItems date={date} homeData={this.props.firebase.defaultHomeData} />} />
                    </div>
                </div>
            </div >
        );
    }
}

class TotalItems extends Component {
    render() {
        if (!this.props.homeData) { return (<div></div>) }
        var deadlines = 0
        this.props.homeData.Chores.forEach(element => {
            if (element.Deadline) {
                if (element.Deadline.toDate().getMonth() === this.props.date.getMonth() && element.Deadline.toDate().getDate() === this.props.date.getDate()) {
                    deadlines += 1
                }
            }
        });
        this.props.homeData.Payments.forEach(element => {
            if (element.Deadline) {
                if (element.Deadline.toDate().getMonth() === this.props.date.getMonth() && element.Deadline.toDate().getDate() === this.props.date.getDate()) {
                    deadlines += 1
                }
            }
        })
        if (deadlines <= 0) {
            return (<div />)
        }

        return (
            //original item badge
            //<div><br /><div className="itemsBadge">{deadlines}</div></div>
            <div>
                <button type="button" id="modalButton" class="btn btn-primary" data-toggle="modal" data-target="#listModal">
                    {deadlines}
                </button>

                <div class="modal fade" id="listModal" tabindex="-1" role="dialog" aria-labelledby="listModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="listModalLabel">Events due</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p>
                                    You have {deadlines} chore(s) due on this day!
                            </p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

class ChoresList extends Component {
    constructor(props) {
        super(props)
        this.handleCompleteButton = this.handleCompleteButton.bind(this)
    }
    handleCompleteButton(e) {
        this.props.firebase.completeItem(e, "Chores")
    }
    render() {
        return (
            <div className="categoryFrame">
                <ul className="listFrame">
                    <h2 className="homeTitle">
                        <Link className="homeTitle" to={ROUTES.CHORES}>Chores</Link>
                        <button className="addButtonFrame" data-toggle="modal" data-target="#Chores" aria-labelledby="addChore"><Add className="addButton"></Add></button>
                    </h2>
                    {this.props.chores.map((chore) => (
                        <div className="card itemFrame mt-1" key={chore.Timestamp}>
                            <div className="card-body ">
                                <li>
                                    <div className="item">
                                        <button type="button" className="options btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownOptions">
                                            <button className="dropdown-item" onClick={() => { this.handleCompleteButton(chore.Timestamp) }}> Complete</button>
                                            <button className="dropdown-item">Edit</button>
                                            <button className="dropdown-item">Add to Calender</button>
                                        </div>
                                        <p className="card-text">{chore.Title}</p>
                                    </div>
                                </li>
                                {chore.Deadline !== undefined &&
                                    <label className="card-text">Due: {chore.Deadline.toDate().toLocaleString()}</label>
                                }
                            </div>
                        </div>
                    ))}
                </ul>
            </div >
        )
    }
}

class SuppliesList extends Component {
    constructor(props) {
        super(props)
        this.handleCompleteButton = this.handleCompleteButton.bind(this)
    }
    handleCompleteButton(e) {
        this.props.firebase.completeItem(e, "Supplies")
    }
    render() {
        return (
            <div className="categoryFrame">
                <ul className="listFrame">
                    <h2 className="homeTitle">
                        <Link className="homeTitle" to={ROUTES.SUPPLIES}>Supplies</Link>
                        <button className="addButtonFrame" data-toggle="modal" data-target="#Supplies" aria-labelledby="AddSupply"><Add className="addButton"></Add></button>
                    </h2>
                    {this.props.supplies.map((supply) => (
                        <div className="card itemFrame mt-1" key={supply.Timestamp}>
                            <div className="card-body" >
                                <li>
                                    <div className="item" >
                                        <button type="button" className="options btn btn-primary dropdown-toggle" id="dropdownOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownOptions">
                                            <button className="dropdown-item" onClick={() => { this.handleCompleteButton(supply.Timestamp) }}> Complete</button>
                                            <button className="dropdown-item">Edit</button>
                                            <button className="dropdown-item">Add to Calender</button>
                                        </div>
                                        <p className="card-text" >{supply["Supply Title"]}</p>
                                    </div>
                                </li>
                                <label className="card-text">Quantity: {supply["Supply Amount"]} items</label>
                            </div>
                        </div>
                    ))}
                </ul>
            </div >
        )
    }
}
class PaymentsList extends Component {
    constructor(props) {
        super(props)
        this.handleCompleteButton = this.handleCompleteButton.bind(this)
    }
    handleCompleteButton(e) {
        this.props.firebase.completeItem(e, "Payments")
    }
    render() {
        return (
            <div className="categoryFrame">
                <ul className="listFrame">
                    <h2 className="homeTitle">
                        <Link className="homeTitle" to={ROUTES.PAYMENTS}>Payments</Link>
                        <button className="addButtonFrame" data-toggle="modal" data-target="#Payments"><Add className="addButton"></Add></button>
                    </h2>
                    {this.props.payments.map((payment) => (
                        <div className="card itemFrame mt-1" key={payment.Timestamp}>
                            <div className="card-body">
                                <li key={payment.Timestamp}>
                                    <span className="item">

                                        <button type="button" className="options btn btn-primary dropdown-toggle" id="dropdownOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownOptions">
                                            <button className="dropdown-item" onClick={() => { this.handleCompleteButton(payment.Timestamp) }}>Complete</button>
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
                                <label className="card-text">Amount: ${payment["Payment Amount"]}</label>
                            </div>
                        </div>
                    ))}
                </ul>
            </div >
        )
    }
}

class HistoryList extends Component {
    updateHistoryInfo(historyItem) {
        if (historyItem.Completed) {
        }
        var testUser = this.props.home.Users.find(user => user["User ID"] === historyItem.Author)
        if (testUser) {
            historyItem.displayName = testUser["Display Name"]
        }
        var itemTitle
        if (this.props.home.Chores.find(chore => chore.Timestamp.isEqual(historyItem["Item ID"])) !== undefined) {
            itemTitle = this.props.home.Chores.find(chore => chore.Timestamp.isEqual(historyItem["Item ID"])).Title
        }
        if (this.props.home.Supplies.find(supply => supply.Timestamp.isEqual(historyItem["Item ID"])) !== undefined) {
            itemTitle = this.props.home.Supplies.find(supply => supply.Timestamp.isEqual(historyItem["Item ID"]))["Supply Title"]
        }

        if (this.props.home.Payments.find(payment => payment.Timestamp.isEqual(historyItem["Item ID"])) !== undefined) {
            itemTitle = this.props.home.Payments.find(chore => chore.Timestamp.isEqual(historyItem["Item ID"]))["Payment Title"]
        }
        historyItem.itemTitle = itemTitle

        if (!this.props.imageURLs) {
            historyItem.imageURL = DefaultLogo
            return historyItem
        }
        if (this.props.imageURLs[historyItem.Author] === undefined) {
            historyItem.imageURL = DefaultLogo
            return historyItem
        }

        historyItem.imageURL = this.props.imageURLs[historyItem.Author]
        return historyItem
    }
    render() {
        const history = this.props.history.map((historyItem) => {
            return this.updateHistoryInfo(historyItem)
        })
        return (
            <div className="historyFrame">
                <ul className="listFrame">
                    <h2 className="homeTitle">
                        History
                    </h2>
                    {history.map((historyItem) => (

                        <div className="card itemFrame mt-1" key={historyItem.Timestamp} >
                            <div className="card-body">
                                <div className="historyProfileContainer">
                                    <img className="historyProfilePhoto" src={historyItem.imageURL} alt={historyItem.displayName}></img>
                                </div>
                                <div className="historyContent">
                                    <li>
                                        <span className="item">
                                            {historyItem.Completed &&
                                                <div>
                                                    <p className="card-text">{historyItem.displayName} completed {historyItem.itemTitle}</p>
                                                    <p className="card-text">Completed: {historyItem.Timestamp.toDate().toDateString()}</p>
                                                </div>
                                            }
                                            {!historyItem.Completed &&
                                                <div>
                                                    <p className="card-text">{historyItem.displayName} created {historyItem.itemTitle} </p>
                                                    <p className="card-text">Created: {historyItem.Timestamp.toDate().toDateString()}</p>
                                                </div>
                                            }
                                        </span>
                                    </li>
                                </div>
                            </div>
                        </div>
                    ))}


                </ul>
            </div >
        )
    }
}


const condition = authUser => !!authUser;
export default compose(withAuthorization(condition), withFirebase, withRouter)(Home);