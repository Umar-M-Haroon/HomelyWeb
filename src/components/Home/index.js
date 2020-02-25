import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
//import Linker from '../Home/payment';

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
                <div> 
                    <center>
                        <a href="https://www.paypal.com/us/home">
                        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.hotukdeals.com%2Fimages%2Fmerchants%2FlongDescription%2Fpaypal-logo.jpg&f=1&nofb=1" alt="PayPal Link"></img>
                        </a>
                        <a href="https://venmo.com/">
                        <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.aricheryou.com%2Fwp-content%2Fuploads%2F2017%2F09%2Fvenmo-150x150.png&f=1&nofb=1" alt="Venmo Link"></img>
                        {/* <img src="venmo.jpg" alt="Venmo Link" style="width:70px;height:45px"></img> */}
                        </a>
                    </center>
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

