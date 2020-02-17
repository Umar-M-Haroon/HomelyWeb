import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

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
            <Link className="navbar-brand" to={ROUTES.HOME}>Homely</Link>
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