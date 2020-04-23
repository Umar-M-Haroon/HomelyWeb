import Chart from 'chart.js';
import React, { Component } from 'react';
import 'react-calendar/dist/Calendar.css';
import { ReactComponent as Add } from '../../plus.svg';
import { withFirebase } from '../Firebase';
import AddItem from '../Home/Add Item/AddItemForm';
import '../Home/Home.css';
import { withAuthorization } from '../Session';
import './Payments.css';

class Payments extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            payments: [],
            users: [],
            chartLabels: [],
            history: [],
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
    chartRef = React.createRef();

    componentDidMount() {
        //Set up home page with appropriate data
        //calls the homes function to get the current homes the user has
        //it then iterates through each home which is a document in firebase terms and will get the data which is a javascript object
        //as it iterates through it adds to a generic home
        this.listener = this.props.firebase.homes().onSnapshot({ includeMetadataChanges: true }, (
            snapshot => {
                if (!this.state.loading) {
                    //we have a change in the house, this isn't the first time loading.
                    this.notifyMe()
                }
                snapshot.forEach(doc => {
                    var allPayments = []
                    var allUsers = []
                    var venmoUsers = []
                    var userLabels = []
                    var home = doc.data();
                    this.props.firebase.defaultHomeData = home
                    this.props.firebase.defaultHome = doc.id
                    home.Payments.forEach(payment => {
                        allPayments.push(payment);
                    })
                    //iterates through the document's chores and adds to an array that the home page can read


                    home.Users.forEach(user => {
                        if (user["Venmo ID"] !== undefined && user["Venmo ID"] !== "") {
                            venmoUsers.push(user)
                        }
                        allUsers.push(user);
                        userLabels.push(user["Display Name"]) // for chart labels
                        // for chart data
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
                    let dataset = []
                    for (let index in allUsers) {
                        let user = allUsers[index]
                        let newPayments = [];
                        newPayments = allPayments.filter((payment) => {
                            let completedItems = user["Completed Items"].find(item => {
                                return item.isEqual(payment.Timestamp)
                            })
                            return (completedItems !== undefined)
                        })
                        let totalAmount = 0
                        newPayments = newPayments.forEach((payment) => {
                            totalAmount += payment["Payment Amount"]
                        })
                        dataset.push(totalAmount)
                    }
                    this.setState({
                        payments: allPayments,
                        users: allUsers,
                        chartLabels: userLabels,
                        home: home,
                        venmoUsers: venmoUsers,
                        loading: false,
                        dataset: dataset
                    }, () => {
                        //redering the chart
                        var myChartRef = this.chartRef.current.getContext("2d");
                        new Chart(myChartRef, {
                            type: "doughnut",
                            data: {
                                //Bring in data
                                labels: this.state.chartLabels,
                                datasets: [
                                    {
                                        label: "Payments",
                                        data: dataset,
                                        backgroundColor: [
                                            'rgba(255, 99, 132, 1)',
                                            'rgba(54, 162, 235, 1)',
                                            'rgba(255, 206, 86, 1)',
                                            'rgba(75, 192, 192, 1)',
                                            'rgba(153, 102, 255, 1)'
                                        ],
                                    }
                                ]
                            },
                            options: {
                                //Customize chart options
                                animation: {
                                    animationScale: true
                                },
                                responsive: true,
                                maintainAspectRatio: false,
                                title: {
                                    display: true,
                                    position: "top",
                                    text: "Distribution of Payments",
                                    fontSize: 32,
                                    fontColor: "#111",
                                    padding: 10
                                },
                                legend: {
                                    display: true,
                                    position: "right",
                                    labels: {
                                        fontColor: "#333",
                                        fontSize: 22
                                    }
                                }
                            }
                        });
                    });
                    this.setState({ chartLabels: userLabels })
                    //while also getting the categories, it also gets the users and sets a default home.
                    //These are needed for assigning users.
                })
            }))
    }

    componentWillUnmount() {
        this.listener()
    }

    render() {
        const { payments, users, loading } = this.state;
        return (
            <div>
                {loading && <div>Loading ...</div>}
                <h1 align="center"><strong>Users</strong></h1>
                {<UserList users={users} completed={this.state.dataset} />}
                <div className="row no-gutters flex-nowrap">
                    <div className="col">
                        <AddItem users={this.state.users} type="Payments" />
                        {<PaymentsList users={this.state.venmoUsers} payments={payments} firebase={this.props.firebase} />}
                    </div>
                    <div className="col">
                        <canvas id="myChart" ref={this.chartRef}></canvas>
                    </div>
                </div>
            </div >
        );
    }
}

class PaymentsList extends Component {
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
                        <label className="homeTitle">Payments</label>
                        <button className="addButtonFrame" data-toggle="modal" data-target="#Payments"><Add className="addButton"></Add></button>
                    </h2>
                    {this.props.payments.map((payment) => !payment.Completed && (
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
                                <label className="card-text">Amount: ${payment["Payment Amount"]}</label>
                            </div>
                        </div>
                    ))}
                </ul>
            </div >
        )
    }
}

const UserList = ({ users, completed }) => (
    <div className="row no-gutters flex-nowrap">
        {users.map((label, index) => (
            <div className="col">
                <div className="userFrame">
                    <div className="userTitle">
                        <label className="userTitle"> {label["Display Name"]}  </label>
                    </div>

                    {!isNaN(completed[0]) &&
                        <label className="userBody">Completed Amount: ${completed[index]}</label>
                    }
                </div>
            </div>
        ))}
    </div>

);

const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(Payments));