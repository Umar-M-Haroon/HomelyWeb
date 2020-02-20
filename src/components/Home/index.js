import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import './Home.css'
// import { ReactComponent as Options } from '../../itemOptions.svg';
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            chores: [],
            supplies: []
        };
    }
    componentDidMount() {
        var allChores = []
        var allSupplies = []
        this.setState({ loading: false });
        this.props.firebase.homes()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    console.log(doc.data());
                    doc.data().Chores.forEach(chore => {
                        console.log(chore.completed);
                        if (chore.Completed !== true) {
                            allChores.push(chore.Title);
                            return chore.Title;
                        }
                    });
                    doc.data().Supplies.forEach(supply => {
                        if (supply.Completed !== true) {
                            allSupplies.push(supply["Supply Title"]);
                            return supply["Supply Title"];
                        }
                    });
                    doc.data().Payments.forEach(payment => {
                        if (payment.Completed !== true) {
                            allSupplies.push(payment["Payment Title"]);
                            return payment["Payment Title"];
                        } 
                    })
                    this.setState({
                        chores: allChores,
                        supplies: allSupplies,
                        loading: false
                    })
                })
            }).catch(error => {
                console.log(error);
            });
    }

    componentWillUnmount() {
        // this.props.firebase.users().off();
    }

    render() {
        const { chores, supplies, loading } = this.state;
        return (
            <div>
                <h1>Home</h1>
                {loading && <div>Loading ...</div>}
                <div className="categories">
                    {<ChoresList chores={chores} />}
                    {<SuppliesList supplies={supplies} />}
                    {<PaymentsList payments={chores} />}
                </div>
            </div>
        );

    }
}

const ChoresList = ({ chores }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="Title">Chores</h2>
            {chores.map(chore => (
                <div className="itemFrame">
                    <span className="item">
                        {chore} <button type="button" className="options btn btn-primary">Options</button>
                    </span>
                </div>
            ))}
        </ul>
    </div >
);

const SuppliesList = ({ supplies }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="Title">Supplies</h2>
            {supplies.map(supply => (
                <div className="itemFrame">
                    <span className="item">
                        {supply} 
                        <button type="button" className="options btn btn-primary">Options</button>
                    </span>
                </div>
            ))}
        </ul>
    </div >
)
const PaymentsList = ({ payments }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="Title">Payments</h2>
            {payments.map(payment => (
                <div className="itemFrame">
                    <span className="item">
                        {payment} <button type="button" className="options btn btn-primary">Options</button>
                    </span>
                </div>
            ))}
        </ul>
    </div >
)

const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(Home));

