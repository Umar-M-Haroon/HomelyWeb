import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import './Home.css'
import { ReactComponent as Options } from '../../itemOptions.svg';
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
                {loading && <div>Loading ...</div>}
                {<ChoresList chores={chores} />}
            </div>
        );

    }
}

const ChoresList = ({ chores }) => (
    <div class="choreFrame">
        <h2>Chores</h2>
        <ul>
            {chores.map(chore => (
                <li>
                    <span className="item">
                        {chore} <button type="button" className="optionsButton"><Options className="itemOptions">Options</Options></button>
                    </span>
                </li>
            ))}
        </ul>
    </div >
);


const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(Home));

