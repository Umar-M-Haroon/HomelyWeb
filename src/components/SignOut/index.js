import React from 'react';
import { withFirebase } from '../Firebase';
const SignOutButton = ({ firebase }) => (
    <button type="button" className="btn btm-sm btn-outline-secondary" onClick={firebase.doSignOut}>
        Sign Out
    </button>
);

export default withFirebase(SignOutButton);