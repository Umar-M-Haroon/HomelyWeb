import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import './Home.css'
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            chores: [],
        };
    }
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

