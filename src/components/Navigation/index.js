import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
// import { ReactComponent as Logo } from '../../homely-logo.svg';
import { AuthUserContext } from '../Session';

const Navigation = ({ authUser }) => (
    <div>
        <AuthUserContext.Consumer>
            {
                authUser => authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = () => (
    <div>
        <nav className="navbar navbar-light">
            <Link className="navbar-brand" to={ROUTES.HOME}> <strong>Home</strong></Link>
            <Link className="navbar-brand" to={ROUTES.CHORES}>Chores</Link>
            <Link className="navbar-brand" to={ROUTES.SUPPLIES}>Supplies</Link>
            <Link className="navbar-brand" to={ROUTES.PAYMENTS}>Payments</Link>
            <Link className="navbar" to={ROUTES.ACCOUNT}>Account</Link>
        </nav>
    </div>
);

const NavigationNonAuth = () => (
    <div>
        <nav className="navbar navbar-light">
            <Link className="navbar-brand" to={ROUTES.HOME}>Homely</Link>
        </nav>
    </div>
);

export default Navigation;