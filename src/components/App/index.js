import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import ChoresPage from '../Chores';
import CreateHome from '../CreateHome';
import HomePage from '../Home';
import LandingPage from '../Landing';
import Navigation from '../Navigation';
import PasswordForgetPage from '../PasswordForget';
import PaymentsPage from '../Payments';
import { withAuthentication } from '../Session';
import SignInPage from '../SignIn';
import SignUpPage from '../SignUp';
import SuppliesPage from '../Supplies';



const App = () => (
    <Router>
        <div>
            <Navigation />
            <hr />
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
            <Route path={ROUTES.CHORES} component={ChoresPage} />
            <Route path={ROUTES.SUPPLIES} component={SuppliesPage} />
            <Route path={ROUTES.PAYMENTS} component={PaymentsPage} />
            <Route path={ROUTES.CREATE_HOME} component={CreateHome} />
        </div>
    </Router>
);

export default withAuthentication(App);