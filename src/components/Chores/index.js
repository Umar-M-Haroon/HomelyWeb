import Chart from 'chart.js';
import React, { Component } from 'react';
import 'react-calendar/dist/Calendar.css';
import { ReactComponent as Add } from '../../plus.svg';
import { withFirebase } from '../Firebase';
import AddItem from '../Home/Add Item/AddItemForm';
import '../Home/Home.css';
import { withAuthorization } from '../Session';
import './Chores.css';

class Chores extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            chores: [],
            users: [],
            chartLabels: [],
            history: [],
            home: ""
        };
    }
    chartRef = React.createRef();

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
                    var allUsers = []
                    var venmoUsers = []
                    var userLabels = []
                    var home = doc.data();
                    this.props.firebase.defaultHomeData = home
                    this.props.firebase.defaultHome = doc.id
                    home.Chores.forEach(chore => {
                        // if (chore.Completed !== true) {
                        allChores.push(chore);
                        // }
                    });
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
                    this.setState({
                        chores: allChores,
                        users: allUsers,
                        chartLabels: userLabels,
                        home: home,
                        venmoUsers: venmoUsers,
                        loading: false,
                    }, () => {
                        //redering the chart
                        let dataset = []
                        for (let index in allUsers) {
                            let user = allUsers[index]
                            let newChores = [];
                            newChores = this.state.chores.filter((chore) => {
                                let completedItems = user["Completed Items"].find(item => {
                                    return item.isEqual(chore.Timestamp)
                                })
                                return (completedItems !== undefined)
                            })
                            dataset.push(newChores.length)
                        }
                        
                        var myChartRef = this.chartRef.current.getContext("2d");
                        new Chart(myChartRef, {
                            type: "doughnut",
                            data: {
                                //Bring in data
                                labels: this.state.chartLabels,
                                datasets: [
                                    {
                                        label: "Chores",
                                        data: dataset,
                                        backgroundColor: [
                                            '#EB5757',
                                            '#27AE60',
                                            'F2994A',
                                            '2F80ED',
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
                                    text: "Distribution of Chores",
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
                                },
                            }
                        });
                    });
                    // this.setState({ chartLabels: userLabels })
                    // console.log(this.state.chartLabels)
                    //while also getting the categories, it also gets the users and sets a default home.
                    //These are needed for assigning users.
                })
            }))
    }

    componentWillUnmount() {
        this.listener()
    }

    render() {
        const { chores, users, loading } = this.state;
        return (
            <div>
                {loading && <div>Loading ...</div>}
                <h1 align="center"><strong>Users</strong></h1>
                {<UserList users={users} />}
                <h1 align="center"><strong></strong></h1>
                <div className="row no-gutters flex-nowrap">
                    {/* <div className="col">
                        <div className="center-Logo-Chores">
                            <h1 align="center"> <strong>Chores</strong></h1>
                        </div>
                    </div> */}
                    <div className="col">
                        <AddItem users={this.state.users} type="Chores" />
                        {<ChoresList chores={chores} />}
                    </div>
                    <div className="col">
                        <canvas id="myChart" ref={this.chartRef}></canvas>
                    </div>
                </div>
            </div >
        );
    }
}


const ChoresList = ({ chores }) => (
    <div className="choresFrame">
        <ul className="listFrame">
            <h2 className="homeTitle">
                <label className="homeTitle">Current Chores</label>
                <button className="addButtonFrame" data-toggle="modal" data-target="#Chores" aria-labelledby="addChore"><Add className="addButton"></Add></button>
            </h2>
            {chores.map((chore) => !chore.Completed && (
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

const UserList = ({ users }) => (
    <div className="row no-gutters flex-nowrap">
        {users.map((label) => (
            <div className="col">
                <div className="userFrame"> 
                    <div className="userTitle">
                        <label className="userTitle"> {label["Display Name"]}  </label>
                    </div>
                    <label className="userBody">Completed Chores:</label>
                </div>
            </div>
        ))}
    </div>

);

const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(Chores));