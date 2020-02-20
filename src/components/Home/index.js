import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Calendar from 'react-calendar';
import './Home.css'
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            chores: [],
            date: new Date()
        };
    }

    /*RUN npm i react-calendar*/
    /*Creating the state for the calendar*/
  
    /*A couple of the functions that are listed on the website that I posted on basecamp. At the moment, 
    onClickDay is just set to pop up that you have clicked on a day as I am unsure on how to link it to the 
    events that we have already set up*/
    onChange = date => this.setState({ date })
    onClickDay = value => alert('Clicked on a day')

    componentDidMount() {
        var allChores = []
        this.setState({ loading: false });
        this.props.firebase.homes()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    doc.data().Chores.forEach(chore => {
                        allChores.push(chore.Title);
                        return chore.Title;
                    });
                    doc.data()
                    this.setState({
                        chores: allChores,
                        loading: false,
                    })
                    console.log(allChores);
                })
            }).catch(error => {
                console.log(error);
            });
    }

    componentWillUnmount() {
        // this.props.firebase.users().off();
    }

    render() {
        const { chores, loading } = this.state;
        return (
            <div>
                <h1>Home</h1>
                <h2>Chores</h2>
                {loading && <div>Loading ...</div>}
                <div class="frame">
                <h2>Chores</h2>
                {<ChoresList chores={chores} />}
                </div>
                {/*Rendering the calendar*/}
                <Calendar
                    onChange={this.onChange}
                    value={this.state.date}
                    onClickDay={this.onClickDay}
                />
            </div>
        );
        
    }
}

const ChoresList = ({ chores }) => (
    <ul>
        {chores.map(chore => (
         <li>
             <span>
                  {chore}
             </span>
         </li>
        ))}
    </ul>
);


const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(Home));

