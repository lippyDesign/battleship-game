import React, {Component} from 'react';
import { browserHistory } from 'react-router';

import Navbar from '../components/Navbar';
import HomePageHeader from '../components/HomePageHeader';
import HomePageMain from '../components/HomePageMain';
import GameContainer from '../components/GameContainer';

class HomePage extends Component {
    componentWillMount() {
        if (Meteor.user()) {
            browserHistory.push('/');
        }
    }

    render() {
        
        return (
            <div>
                <Navbar/>
                <main className="mainContainer">
                    <GameContainer/>
                </main>
            </div>
        )
    }
}

export default HomePage;