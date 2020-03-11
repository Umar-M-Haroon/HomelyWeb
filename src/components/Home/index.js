import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import './Home.css'
import { ReactComponent as Add } from '../../plus.svg';
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
                <h1 align="center"><strong>Home</strong></h1>
                {loading && <div>Loading ...</div>}
                <div className="row no-gutters flex-nowrap">
                    <div class="col">
                        {<ChoresList chores={chores} />}
                    </div>
                    <div class="col">
                        {<SuppliesList supplies={supplies} />}
                    </div>
                    <div class="col">
                        {<PaymentsList payments={payments} />}
                    </div>
                </div>
            </div>
        );

    }
}

const ChoresList = ({ chores }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="homeTitle">
                <Link className="homeTitle" to={ROUTES.CHORES}>Chores</Link>
                <button className="addButtonFrame"><Add className="addButton">A</Add></button>
            </h2>
            {chores.map((chore) => (
                <div className="card itemFrame mt-1">
                    <div className="card-body ">
                        <li key={chore.Timestamp}>
                            <div className="item">
                                <button type="button" className="options btn btn-primary dropdown-toggle" id="dropdownOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</button>
                                <div class="dropdown-menu" aria-labelledby="dropdownOptions">
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

const SuppliesList = ({ supplies }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="homeTitle">
            <Link className="homeTitle" to={ROUTES.SUPPLIES}>Supplies</Link>
                <button className="addButtonFrame"><Add className="addButton">A</Add></button>
            </h2>
            {supplies.map((supply) => (
                <div className="card itemFrame mt-1">
                    <div className="card-body">
                        <li key={supply.Timestamp}>
                            <div className="item">
                                <button type="button" className="options btn btn-primary dropdown-toggle" id="dropdownOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</button>
                                <div class="dropdown-menu" aria-labelledby="dropdownOptions">
                                    <button className="dropdown-item">Complete</button>
                                    <button className="dropdown-item">Edit</button>
                                    <button className="dropdown-item">Add to Calender</button>
                                </div>
                                <p className="card-text">{supply["Supply Title"]}</p>
                            </div>
                        </li>
                    </div>
                </div>
            ))}
        </ul>
    </div >
)
const PaymentsList = ({ payments }) => (
    <div className="categoryFrame">
        <ul className="listFrame">
            <h2 className="homeTitle">
            <Link className="homeTitle" to={ROUTES.PAYMENTS}>Payments</Link>
                <button className="addButtonFrame"><Add className="addButton">A</Add></button>
            </h2>
            {payments.map((payment) => (
                <div className="card itemFrame mt-1">
                    <div className="card-body">
                        <li key={payment.Timestamp}>
                            <span className="item">

                                <button type="button" className="options btn btn-primary dropdown-toggle" id="dropdownOptions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</button>
                                <div class="dropdown-menu" aria-labelledby="dropdownOptions">
                                    <button className="dropdown-item">Complete</button>
                                    <button className="dropdown-item">Edit</button>
                                    <button className="dropdown-item">Add to Calender</button>
                                </div>
                                <p className="card-text">{payment["Payment Title"]}</p>
                            </span>
                        </li>
                    </div>
                </div>
            ))}
        </ul>
    </div >
)

const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(Home));

