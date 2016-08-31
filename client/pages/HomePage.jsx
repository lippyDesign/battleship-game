import React, {Component} from 'react';
import { browserHistory } from 'react-router';

import Navbar from '../components/Navbar';
import HomePageHeader from '../components/HomePageHeader';
import HomePageMain from '../components/HomePageMain';

class HomePage extends Component {

    componentWillMount() {
        if (Meteor.userId()) {
            browserHistory.push('/dashboard');
        }
    }

    render() {
        return (
            <div>
                <Navbar/>
                <HomePageHeader/>
                <HomePageMain/>
            </div>
        )
    }
}

export default HomePage;