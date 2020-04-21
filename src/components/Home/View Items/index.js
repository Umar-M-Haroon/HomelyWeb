import React, { Component } from "react";
import Calendar from 'react-calendar';
import { withFirebase } from '../../Firebase';
import { withAuthorization } from '../../Session';


class ViewItemList extends Component {
    render() 
    {
        return <p>testcxzv,mb</p>
    }
}

const condition = authUser => !!authUser;
export default withFirebase(withAuthorization(condition)(ViewItemList));