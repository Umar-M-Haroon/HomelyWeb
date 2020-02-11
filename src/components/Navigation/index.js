import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
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
            <Link className="navbar" to={ROUTES.LANDING}>Landing</Link>
            <Link className="navbar" to={ROUTES.ACCOUNT}>Account</Link>
            <SignOutButton />
        </nav>
    </div>
);

const NavigationNonAuth = () => (
    <div>
        <ul>
            <li>
                <Link to={ROUTES.SIGN_IN}>Sign In</Link>
            </li>
            <li>
                <Link to={ROUTES.LANDING}>Landing</Link>
            </li>
        </ul>
    </div>
);

export default Navigation;