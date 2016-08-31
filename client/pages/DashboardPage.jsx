import React, {Component} from 'react';
import { browserHistory } from 'react-router';

import Navbar from '../components/Navbar';
import CompOrHumanSelector from '../components/CompOrHumanSelector';

class DashboardPage extends Component {
    componentWillMount() {
        if (!Meteor.userId()) {
            browserHistory.push('/');
        }
    }
    render() {
        return (
            <div>
                <Navbar/>
                <main className="mainContainer">
                    <CompOrHumanSelector/>
                </main>
            </div>
        )
    }
}

export default DashboardPage;