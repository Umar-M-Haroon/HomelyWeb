import React, { Component } from 'react';
import 'react-calendar/dist/Calendar.css';
import { ReactComponent as Add } from '../../plus.svg';
import { withFirebase } from '../Firebase';
import AddItem from '../Home/Add Item/AddItemForm';
import '../Home/Home.css';
import { withAuthorization } from '../Session';
import './Supplies.css';

class Supplies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            supplies: [],
            users: [],
            home: ""
        };
    }
    notifyMe() {
        // Let's check if the browser supports notifications
        if (this.state.loading) { return }
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
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
                snapshot.forEach(doc => {
                    if (!this.state.loading) {
                        //we have a change in the house, this isn't the first time loading.
                        this.notifyMe()
                    }
                    this.setState({ loading: false });
                    var allSupplies = []
                    var allUsers = []
                    var allHistory = []
                    var venmoUsers = []
                    var home = doc.data();
                    this.props.firebase.defaultHomeData = home
                    this.props.firebase.defaultHome = doc.id

                    home.Supplies.forEach(supply => {
                        if (supply.Completed !== true) {
                            allSupplies.push(supply);
                        }
                    });
                    //add each payment, supply, and chore that is finished to the allHistory list
                    //iterates through the document's chores/supplies/payments and adds to an array that the home page can read

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
                                console.error(`Error getting URL ${error}`)
                            })
                    })
                    this.setState({
                        supplies: allSupplies,
                        users: allUsers,
                        home: home,
                        venmoUsers: venmoUsers,
                        loading: false,
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
        const { supplies, loading } = this.state;
        return (
            <div>
                {loading && <div>Loading ...</div>}
                <div>
                    <h1><strong>  Supplies</strong></h1>
                </div>
                <div className="row no-gutters flex-nowrap">
                    <div className="col">
                        <AddItem users={this.state.users} type="Supplies" />
                        {<SuppliesList supplies={supplies} firebase={this.props.firebase} />}
                    </div>
                </div>
            </div >
        );
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
            <div className="suppliesFrame">
                <ul className="listFrame">
                    <h2 className="homeTitle">
                        <label className="homeTitle">Current Supplies</label>
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


//credit code to: https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
// function notifyMe() {
//     // Let's check if the browser supports notifications
//     if (!("Notification" in window)) {
//       alert("This browser does not support desktop notification");
//     }

//     // Let's check whether notification permissions have already been granted
//     else if (Notification.permission === "granted") {
//       // If it's okay let's create a notification
//       var notification = new Notification("Notifications have been enabled");
//     }

//     // Otherwise, we need to ask the user for permission
//     else if (Notification.permission !== "denied") {
//       Notification.requestPermission().then(function (permission) {
//         // If the user accepts, let's create a notification
//         if (permission === "granted") {
//           var notification = new Notification("Notifications are enabled");
//         }
//       });
//     }

//     else if (Notification.permission === "granted" && (chore.completed == "true" | supply.completed == "true" | payment.completed == "true"))
//     {
//         var note1 = 'This chore/supply/payment has been finished.';
//         var notification1 = new Notification(note1);
//     }
//     else if (Notification.permission === "granted" && chore.completed == "false")
//     {
//         var note4 = 'You have added the chore ' + chore.Title + '.';
//         var notificaiton4 = new Notification(note4);
//     }
//     else if (Notification.permission === "granted" && supply.completed == "false")
//     {
//         var note3 = 'You have added the supply ' + supply.Title + '.';
//         var notification3 = new Notification(note3);
//     }
//     else if (Notification.permission === "granted" && payment.completed === "false")
//     {
//         var note2 = 'You have added the payment ' + payment.Title + '.';
//         var notificaiton2 = new Notification(note2);
//     }


//   }


const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(Supplies));