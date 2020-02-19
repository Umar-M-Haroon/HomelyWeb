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
                <div className="categories">
                    {<ChoresList chores={chores} />}
                    {<SuppliesList supplies={chores} />}
                    {<PaymentsList payments={chores} />}
                </div>
            </div>
        );

    }
}

const ChoresList = ({ chores }) => (
    <div class="categoryFrame">
        <h2>Chores</h2>
        <ul className="listFrame">
            {chores.map(chore => (
                <div className="itemFrame">
                    <span className="item">
                        {chore} <button type="button" className="btn btn-primary">Options</button>
                    </span>
                </div>
            ))}
        </ul>
    </div >
);

const SuppliesList = ({ supplies }) => (
    <div class="categoryFrame">
        <h2>Supplies</h2>
        <ul className="listFrame">
            {supplies.map(supply => (
                <div className="itemFrame">
                    <span className="item">
                        {supply} <button type="button" className="btn btn-primary">Options</button>
                    </span>
                </div>
            ))}
        </ul>
    </div >
)
const PaymentsList = ({ payments }) => (
    <div class="categoryFrame">
        <h2>Payments</h2>
        <ul className="listFrame">
            {payments.map(payment => (
                <div className="itemFrame">
                    <span className="item">
                        {payment} <button type="button" className="btn btn-primary">Options</button>
                    </span>
                </div>
            ))}
        </ul>
    </div >
)

const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(Home));

