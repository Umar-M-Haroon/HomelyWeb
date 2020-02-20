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
            supplies: [],
            payments: []
        };
    }
    componentDidMount() {
        var allChores = []
        var allSupplies = []
        var allPayments = []
        this.setState({ loading: false });
        this.props.firebase.homes()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {

                    doc.data().Chores.forEach(chore => {
                        if (chore.Completed !== true) {
                            allChores.push(chore);
                        }
                    });
                    doc.data().Supplies.forEach(supply => {
                        if (supply.Completed !== true) {
                            allSupplies.push(supply);
                        }
                    });
                    doc.data().Payments.forEach(payment => {
                        if (payment.Completed !== true) {
                            allPayments.push(payment);
                        }
                    })
                    this.setState({
                        chores: allChores,
                        supplies: allSupplies,
                        payments: allPayments,
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
        const { chores, supplies, payments, loading } = this.state;
        return (
            <div>
                <h1>Home</h1>
                {loading && <div>Loading ...</div>}
                <div className="categories">
                    {<ChoresList chores={chores} />}
                    {<SuppliesList supplies={supplies} />}
                    {<PaymentsList payments={payments} />}
                </div>
            </div>
        );

    }
}

const ChoresList = ({ chores }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="Title">Chores</h2>
            {chores.map((chore) => (
                <div className="card itemFrame">
                    <div className="card-body ">
                        <li key={chore.Timestamp}>
                            <div className="item">
                                <button type="button" className="options btn btn-primary">Options</button>
                                <p className="card-text">{chore.Title}</p>
                                <p className="card-text">{chore.Title}</p>
                                <p className="card-text">{chore.Title}</p>
                                <p className="card-text">{chore.Title}</p>
                            </div>
                        </li>
                    </div>
                </div>
            ))}
        </ul>
    </div >
);

const SuppliesList = ({ supplies }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="Title">Supplies</h2>
            {supplies.map((supply) => (
                <div className="itemFrame">
                    <li key={supply.Timestamp}>
                        <span className="item">
                            {supply["Supply Title"]}
                            <button type="button" className="options btn btn-primary">Options</button>
                        </span>
                    </li>
                </div>
            ))}
        </ul>
    </div >
)
const PaymentsList = ({ payments }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="Title">Payments</h2>
            {payments.map((payment) => (
                <div className="itemFrame">
                    <li key={payment.Timestamp}>
                        <span className="item">
                            {payment["Payment Title"]} <button type="button" className="options btn btn-primary">Options</button>
                        </span>
                    </li>
                </div>
            ))}
        </ul>
    </div >
)

const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(Home));

