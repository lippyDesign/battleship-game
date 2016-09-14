import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

import { Staging } from '../../imports/collections/staging';
import { Games } from '../../imports/collections/games';

class compOrHumanSelector extends Component {
    getData() {
        const helperMessage = 'you are currently in a game, finish that game before playing any other game';
        let data = [
            {
                icon: 'fa fa-desktop fa-3x',
                bigText: 'Play Against Computer',
                smallText: 'See if you can beat this super mega powerful battleship computer',
                url: '/create-game/computer'
            },
            {
                icon: 'fa fa-user fa-3x',
                bigText: 'Play Against a Friend',
                smallText: 'Create a game and wait until someone joins it, then beat them',
                url: '/create-game/friend'
            },
            {
                icon: 'fa fa-random fa-3x',
                bigText: 'Play a Random Game',
                smallText: 'Join a random game created by a human being just like yourself',
                url: '/create-game/random-human'
            }
        ];
        return data.map( ({icon, bigText, smallText, url}) => {
            return (
                <section key={`${icon}${bigText}`} onClick={()=> browserHistory.push(url)}>
                    <h1><i className={icon}></i></h1>
                    <h1>{bigText}</h1>
                    <h2>{smallText}</h2>
                </section>
            )
        });
    }
    render() {
        // check if user is already in a game. userAlreadyHasGame will be undefined if user not in a game or the game object if user in game
        let userAlreadyHasGame = this.props.games.find(game => {
            return (game.userOneInfo.createdBy === this.props.currentUser._id && !game.winner) || (game.userTwoInfo.createdBy === this.props.currentUser._id && !game.winner);
        });
        // check if user has a game in the staging area. userStagingGame will be undefined if user has no game staging
        const userStagingGame = this.props.staging.find(game => game.createdBy === this.props.currentUser._id);
        // if user already has game or there is a game staging
        if (userAlreadyHasGame || userStagingGame) {
            const message = userAlreadyHasGame ? "You are already playing a game" : "You already have a game waiting for an opponent"
            return (
                <div className="text-center">
                    <h1>{message}</h1>
                    <h2>You will need to finish that game before you can play any other games</h2>
                    <button onClick={() => browserHistory.push('/create-game/random-human')} className="btn btn-info btn-lg">Go to my game!</button>
                </div>     
            );
        } else {
            return (
                <div className="compOrHumanSelector">
                    {this.getData()}
                </div>
            );
        }
    }
}

export default createContainer( () => {
    Meteor.subscribe('staging');
    Meteor.subscribe('games');
    return {
        staging: Staging.find({}).fetch(),
        games: Games.find({}).fetch(),
        currentUser: Meteor.user()
    };
}, compOrHumanSelector);