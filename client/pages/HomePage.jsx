import React, {Component} from 'react';

import Navbar from '../components/Navbar';
import HomePageHeader from '../components/HomePageHeader';
import HomePageMain from '../components/HomePageMain';
import GameContainer from '../components/GameContainer';

class HomePage extends Component {

    render() {
        if(Meteor.userId()) {
            return (
                <div>
                    <Navbar/>
                    <HomePageHeader/>
                    <HomePageMain/>
                </div>
            )
        }
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